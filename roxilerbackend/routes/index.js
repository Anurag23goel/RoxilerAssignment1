const express = require("express");
const router = express.Router();

// importing controllers
const { getAllProducts, getStatistics, getBarChart, getPieChartData, getCombinedStats } = require("../controllers/products");

// defining routes
router.get("/getAllProducts", getAllProducts);
router.get("/getStatistics", getStatistics);
router.get("/getBarChart", getBarChart);
router.get("/getPieChart", getPieChartData);
router.get("/getCombinedStats", getCombinedStats);

module.exports = router;
