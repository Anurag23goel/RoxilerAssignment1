const mongoose = require("mongoose");
require("dotenv").config();


exports.dbConnection = () => {
    mongoose
        .connect(process.env.DATABASE_URL)
        .then(() => console.log("Connected to DB"))
        .catch((err) => console.log(err));
};