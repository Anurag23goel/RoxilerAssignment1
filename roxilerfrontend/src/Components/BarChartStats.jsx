import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChartStats = () => {
  const [barChartData, setBarChartData] = useState(null); // State for bar chart data
  const [selectedMonth, setSelectedMonth] = useState("3"); // Default to March
  const [isLoading, setIsLoading] = useState(false);
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

  const fetchBarChartStats = async (month) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/getBarChart`,
        {
          params: {
            month: months[month - 1],
          },
        }
      );
      const data = response.data;

      // Map response data to chart-compatible format
      const labels = data.map((item) => item.range);
      const values = data.map((item) => item.count);

      // Set the chart data
      setBarChartData({ labels, values });
    } catch (error) {
      console.error("Error fetching bar chart stats:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount or when selectedMonth changes
  useEffect(() => {
    fetchBarChartStats(selectedMonth);
  }, [selectedMonth]);

  // Handle month change
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Bar Chart Statistics
      </h1>

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
      {isLoading && <p className="text-center">Loading...</p>}

      {/* Bar Chart */}
      {barChartData && !isLoading && (
        <div
          style={{ width: "100%", height: "500px" }}
          className="flex justify-center"
        >
          <Bar
            data={{
              labels: barChartData.labels, // Labels for X-axis
              datasets: [
                {
                  label: "Count of Items by Price Range",
                  data: barChartData.values, // Values for Y-axis
                  backgroundColor: "blue", // Color of Bar
                  borderColor: "black",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                  font: {
                    size: 18,
                  },
                  labels: {
                    color: "black",
                    font: {
                      size: 18,
                    },
                  },
                },
                title: {
                  display: true,
                  text: `Bar Chart for ${months[selectedMonth - 1]}`,
                  color: "black",
                  font: {
                    size: 18,
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Price Range",
                    color: "black",
                    font: {
                      size: 18,
                    },
                  },
                  ticks: {
                    color: "black",
                    font: {
                      size: 16,
                    },
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Count",
                    color: "black",
                    font: {
                      size: 18,
                    },
                  },
                  beginAtZero: true,
                  min: 0, // Minimum value for Y-axis
                  max: 10, // Maximum value for Y-axis
                  ticks: {
                    stepSize: 1, // Step size for Y-axis ticks
                    callback: (value) => value, // Format the ticks as integers
                    color: "black",
                    font: {
                      size: 18,
                    },
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BarChartStats;
