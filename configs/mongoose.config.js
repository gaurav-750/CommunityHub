//requiring mongoose
const mongoose = require("mongoose");

const DB = process.env.DB;

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection successfull to MongoDB Atlas!");
  })
  .catch((err) => console.log("Unable to connect to MongoDB, Error: ", err));
const db = mongoose.connection;

module.exports = db;
