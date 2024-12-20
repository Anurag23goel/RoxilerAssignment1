import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("March"); // Default to March (3)
  const [isLoading, setIsLoading] = useState(false);

  const barStats = () => {
    window.location.href = "/barChartStats";
  };

  const statsForMonth = () => {
    window.location.href = "/statsForMonth";
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/getAllProducts",
        {
          params: {
            page: currentPage,
            search: search.trim(),
            month: month ? month : "", // Dynamically map month number to name
          },
        }
      );
      setProducts(response.data.products);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search, month]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value); // Convert value to number
    setCurrentPage(1); // Reset to the first page on month change
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="flex items-center gap-4 mb-4">
        {/* Search Bar */}
        <input
          type="text"
          className="border p-2 rounded w-1/3"
          placeholder="Search by title, description, or price"
          value={search}
          onChange={handleSearchChange}
        />

        {/* Month Dropdown */}
        <select
          className="border p-2 rounded"
          value={month}
          onChange={handleMonthChange}
        >
          <option value="">Select Month</option>
          {months.map((monthName, index) => (
            <option key={index} value={monthName}>
              {monthName}
            </option>
          ))}
        </select>

        {/* Action Buttons */}
        <button
          onClick={barStats}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Bar Chart Stats
        </button>

        <button
          onClick={statsForMonth}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Show Statistics
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Sold</th>
              <th className="border border-gray-300 px-4 py-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-200 hover:cursor-pointer"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {product.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.title}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${product.price}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {/* Capitalizing the first letter */}
                    {product.category.charAt(0).toUpperCase() +
                      product.category.slice(1)}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    {product.sold ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 object-cover"
                      />
                    ) : (
                      <p>No image available</p> // Placeholder for no image
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center border border-gray-300 py-4"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p>
          Page No: <span>{currentPage}</span>
        </p>

        <div className="flex justify-between items-center gap-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span>
            Page {totalPages > 0 ? currentPage : 0} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>

        <div>
          <p>Per Page: 10</p>
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
