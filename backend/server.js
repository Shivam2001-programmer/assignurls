const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", require("./routes/url"));

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(5000, () => console.log("Server started on port 5000"));
});
