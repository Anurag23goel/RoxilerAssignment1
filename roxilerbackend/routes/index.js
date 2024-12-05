const express = require("express");
const router = express.Router();

// importing controllers
const { getAllProducts, getStatistics, getBarChart, getPieChartData } = require("../controllers/products");

// defining routes
router.get("/getAllProducts", getAllProducts);
router.get("/getStatistics", getStatistics);
router.get("/getBarChart", getBarChart);
router.get("/getPieChart", getPieChartData);

module.exports = router;
