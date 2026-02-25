if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();

const HelloController = require("./controllers/HelloController");
const authRouter = require("./routers/auth");
const movieRouter = require("./routers/movies");
const authentication = require("./middlewares/authentication");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");

//! middleware body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

//! hello endpoint
app.get("/", HelloController.getHello);

//! user endpoint
app.use(authRouter);

//! middleware authentication
app.use(authentication);

//! Movies endpoint
app.use("/movies", movieRouter);
// BAD Practices -> app.use(movieRouter)
// kalo ada middleware yg dipasang didalam movieRouter
// bakal bocor ke endpoint setelahnya

//! middleware errorHandler dibawah untuk menangkap keseluruhan error
app.use(errorHandler);

module.exports = app;
