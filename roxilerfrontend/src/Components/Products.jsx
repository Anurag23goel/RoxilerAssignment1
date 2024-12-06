import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(3); // Default to March (3)
  const [isLoading, setIsLoading] = useState(false);
  
  const barStats = () => {
    window.location.href = "/barChartStats";
  }

  const statsForMonth = () => {
    window.location.href = "/statsForMonth";
  }

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
            month: month ? months[month - 1] : "", // Dynamically map month number to name
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
    setMonth(Number(e.target.value)); // Convert value to number
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
            <option key={index} value={index + 1}>
              {monthName}
            </option>
          ))}
        </select>

          <button onClick={barStats}>
            Bar Chart Stats
          </button>
          
          <button onClick={statsForMonth}>
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
              <th className="border border-gray-300 px-4 py-2">Date of Sale</th>
              <th className="border border-gray-300 px-4 py-2">Sold</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
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
                    {product.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.dateOfSale
                      ? new Date(product.dateOfSale).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.sold ? "Yes" : "No"}
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
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {totalPages > 0 ? currentPage : 0} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsTable;
