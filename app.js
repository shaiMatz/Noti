const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(bodyParser.json());

const indexRouter = require("./routes/index");
app.use('/', indexRouter);

