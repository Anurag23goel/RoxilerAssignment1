const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const { dbConnection } = require("./connections/database");
const Product = require("./models/products");
const routes = require("./routes/index");

// Creating application instance
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 4000;

// Mounting Routes
app.use("/api/v1", routes);

// Default Route
app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

// API for fetching data from third-party API
app.get("/fetch-data", async (req, res) => {
  try {
    // Fetch data from the third party API
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    // Store response data in an array
    const productsArray = response.data;

    // Save all products to the database
    await Product.insertMany(productsArray);

    // return response
    res.status(200).json({ message: "Data fetched and stored successfully!" });
  } catch (error) {
    console.error("Error fetching or saving data:", error.message);
    res.status(500).json({ error: "Failed to fetch or store data" });
  }
});

app.listen(port, () => {
  dbConnection();
  console.log(`Server is running on port http://localhost:${port}`);
});
