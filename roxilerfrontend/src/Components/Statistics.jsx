import axios from "axios";
import React, { useEffect, useState } from "react";

const Statistics = () => {
  const [month, setMonth] = useState(3); // Default to March (3)
  const [statistics, setStatistics] = useState(null); // State to store statistics
  const [isLoading, setIsLoading] = useState(false); // Loading state

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

  const fetchStatistics = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/getStatistics`,
        { params: { month: months[month - 1] } }
      );
      setStatistics(response.data); // Set the fetched data to state
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setIsLoading(false); // Set loading to false after the request is complete
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [month]); // Re-fetch data when the month changes

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Statistics</h1>

      {/* Month Dropdown */}
      <div className="mb-6 text-center">
        <select
          className="border p-2 rounded-lg text-gray-800 bg-white"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
        >
          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="text-center text-lg text-black">Loading...</div>
      ) : (
        statistics && (
          <div className="flex justify-center">
            {/* Statistics Box */}
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
              <div className="text-center">
                {/* Total Sale */}
                <div className="bg-blue-50 p-6 rounded-lg shadow-lg mb-4">
                  <h2 className="text-xl font-semibold text-indigo-600">Total Sale</h2>
                  <p className="text-2xl font-bold text-indigo-800">
                    ${statistics.totalAmountOfSale.toFixed(2)}
                  </p>
                </div>

                {/* Total Sold Items */}
                <div className="bg-green-50 p-6 rounded-lg shadow-lg mb-4">
                  <h2 className="text-xl font-semibold text-green-600">Total Sold Items</h2>
                  <p className="text-2xl font-bold text-green-800">
                    {statistics.totalSoldItems}
                  </p>
                </div>

                {/* Total Unsold Items */}
                <div className="bg-red-50 p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold text-red-600">Total Unsold Items</h2>
                  <p className="text-2xl font-bold text-red-800">
                    {statistics.totalUnsoldItems}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Statistics;
