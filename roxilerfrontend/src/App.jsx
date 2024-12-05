import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductsTable from "./Components/Products";
import BarChartStats from "./Components/BarChartStats";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductsTable />} />
        <Route path="/barChartStats" element={<BarChartStats />} />
      </Routes>
    </Router>
  );
};

export default App;
