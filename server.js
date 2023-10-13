const express = require("express");
const app = express();

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", require("./routes/index.js"));

require("./configs/mongoose.config.js");

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log("Error in running server", err);
    return;
  }

  console.log(`Server is up and running on port: ${process.env.PORT}`);
});
