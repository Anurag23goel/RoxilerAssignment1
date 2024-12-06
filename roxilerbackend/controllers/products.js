const Product = require("../models/products");

// Get all products based on search text
exports.getAllProducts = async (req, res) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = 10; // Default to 10 items per page
    const search = req.query.search || ""; // Search text
    const month = req.query.month || "";

    // Mapping months corresponding to numbers for filtering
    const monthMapping = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    // Get the corresponding month number
    const monthNumber = month ? monthMapping[month] : null;

    // Check if the search term is a valid number (to match the price field)
    const parsedSearch = parseFloat(search);
    const isPriceSearch = !isNaN(parsedSearch);

    // Build the search query
    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            ...(isPriceSearch
              ? [{ price: { $eq: parsedSearch } }] // Only include price search if it's a valid number
              : []),
          ],
        }
      : {};

    // Combine filters (month and search) in the query
    const matchQuery = {
      ...searchQuery,
      ...(monthNumber && {
        $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
      }),
    };

    // Pagination setup
    const skip = (page - 1) * limit;

    // Fetch products with combined query, pagination, and sorting
    const products = await Product.find(matchQuery).skip(skip).limit(limit);

    // Count total matching products
    const totalProducts = await Product.countDocuments(matchQuery);

    // Respond with data
    res.status(200).json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get Statistics based on month
exports.getStatistics = async (req, res) => {
  const { month } = req.query;

  try {
    // Mapping months corresponding to numbers for filtering
    const monthMapping = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    // Function to get month number
    const getMonthNumber = (monthName) => monthMapping[monthName];

    const monthNumber = getMonthNumber(month);

    // Filtering products based on month
    const productsInMonth = await Product.find({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
    });

    // Calculating Total Amount of Sale
    const totalAmountOfSale = productsInMonth.reduce(
      (total, product) => total + product.price,
      0
    );

    // Calculating Total Sold Items
    const totalSoldItems = productsInMonth.reduce(
      (total, product) => total + (product.sold ? 1 : 0),
      0
    );

    // Calculating Total Unsold Items
    const totalUnsoldItems = productsInMonth.length - totalSoldItems;

    res.status(200).json({
      message: "Statistics for month",
      productsInMonth,
      totalAmountOfSale,
      totalSoldItems,
      totalUnsoldItems,
    });
  } catch (error) {
    console.log("Error While Getting Stats for Month", error.message);
    res.status(500).json({ error: "Failed to fetch statistics for month" });
  }
};

// Handler for bar chart with price range and no of products in that range
exports.getBarChart = async (req, res) => {
  const { month } = req.query; // Assuming 'month' is passed as a string like "March"

  try {
    // Convert month name to month number (1 for January, 2 for February, etc.)
    const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1;

    const priceBoundaries = [
      0,
      101,
      201,
      301,
      401,
      501,
      601,
      701,
      801,
      901,
      Infinity,
    ];
    const priceRangeLabels = [
      "$0 - $100",
      "$101 - $200",
      "$201 - $300",
      "$301 - $400",
      "$401 - $500",
      "$501 - $600",
      "$601 - $700",
      "$701 - $800",
      "$801 - $900",
      "$901 and above",
    ];

    const aggregationPipeline = [
      // Filter products for the given month
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
        },
      },
      // Group products by price ranges
      {
        $bucket: {
          groupBy: "$price", // The field to group by (price)
          boundaries: priceBoundaries, // Define ranges
          default: "Other", // For prices outside the defined ranges
          output: {
            count: { $sum: 1 }, // Count of products in each range
          },
        },
      },
    ];

    const result = await Product.aggregate(aggregationPipeline);

    // Map the result into predefined ranges, ensuring all ranges are included
    const priceData = priceRangeLabels.map((label, index) => {
      const bucket = result.find(
        (range) => range._id === priceBoundaries[index]
      );
      return {
        range: label,
        count: bucket ? bucket.count : 0, // Default to 0 if no products in this range
      };
    });

    res.status(200).json(priceData);
  } catch (error) {
    console.error("Error While Getting Stats for Month", error.message);
    res.status(500).json({ error: "Failed to fetch statistics for month" });
  }
};

// Handler for categories pie chart with no of products in each category
exports.getPieChartData = async (req, res) => {
  const { month } = req.query

  try {
    const monthMapping = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    // Function to get month number
    const getMonthNumber = (monthName) => monthMapping[monthName];

    const monthNumber = getMonthNumber(month);

    // Filtering products based on month
    const productsInMonth = await Product.find({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
    });

    const categories = Array.from(
      new Set(productsInMonth.map((product) => product.category))
    );

    const categoryData = categories.map((category) => {
      const count = productsInMonth.filter(
        (product) => product.category === category
      ).length;
      return { category, count };
    });

    res.status(200).json(categoryData);
  } catch (error) {
    console.log("Error getting pie chart", error.message);
    res.status(500).json({ error: "Failed to fetch pie chart data" });
  }
};
