const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT;


const indexRouter = require("./routes/index");
app.use('/', indexRouter);

const postRouter = require("./routes/post_routes");
app.use('/posts', postRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});