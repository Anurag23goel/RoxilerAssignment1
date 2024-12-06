import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
} from "chart.js";

// Registering necessary components for Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const PieChartStats = () => {
  const [pieChartData, setPieChartData] = useState(null); // State for the pie chart data
  const [selectedMonth, setSelectedMonth] = useState("1"); // Default to January
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  // Function to fetch pie chart data based on the selected month
  const fetchPieChartData = async (month) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/getBarChart?month=${months[month - 1]}`
      );
      const data = response.data;

      // Mapping the response data to chart format
      const categories = data.map((item) => item.category);
      const counts = data.map((item) => item.count);

      setPieChartData({
        labels: categories,
        datasets: [{
          data: counts,
          backgroundColor: ["#FF5733", "#33FF57", "#3357FF"], // Colors for each slice
        }],
      });
    } catch (error) {
      console.error("Error fetching pie chart data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount or when selectedMonth changes
  useEffect(() => {
    fetchPieChartData(selectedMonth);
  }, [selectedMonth]);

  // Handle month change
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pie Chart Statistics</h1>

      {/* Dropdown for selecting the month */}
      <div className="mb-4">
        <select
          className="border p-2 rounded"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Loading Indicator */}
      {isLoading && <p>Loading...</p>}

      {/* Pie Chart */}
      {pieChartData && !isLoading && (
        <div className="mt-6" style={{ width: '800px', height: '800px', textAlign: 'center' }}>
          <Pie
            data={pieChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: `Product Categories for ${months[selectedMonth - 1]}`,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PieChartStats;
