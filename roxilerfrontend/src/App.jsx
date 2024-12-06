import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductsTable from "./Components/Products";
import BarChartStats from "./Components/BarChartStats";
import PieChartStats from "./Components/PieChartStats";
import Statistics from "./Components/Statistics";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductsTable />} />
        <Route path="/barChartStats" element={<BarChartStats />} />
        <Route path="/statsForMonth" element={<Statistics />} />
      </Routes>
    </Router>
  );
};

export default App;
