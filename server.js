const express = require("express");
const app = express();

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log("Error in running server", err);
    return;
  }

  console.log(`Server is up and running on port: ${process.env.PORT}`);
});
