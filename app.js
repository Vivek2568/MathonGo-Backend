const express = require("express");
const cors = require("cors");

const chapterRoutes = require("./routes/chapterRoutes");
const rateLimiter = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.set('trust proxy', 1);
app.use(cors());

app.use(express.json());

app.use(rateLimiter);
app.use("/api/v1/chapters", chapterRoutes);
app.use(errorHandler);

module.exports = app;
