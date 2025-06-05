const express = require("express");
const cors = require("cors");
const chapterRoutes = require("./routes/chapterRoutes");
const errorHandler = require("./middlewares/errorHandler");
const setupRateLimiter = require("./middlewares/rateLimiter");

const app = express();
app.set('trust proxy', true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("hello priyanshi");
async function startServer() {
    const rateLimiter = await setupRateLimiter();
    console.log("✅ RateLimiter initialized");


    app.use(rateLimiter);
    app.use("/api/v1/chapters", chapterRoutes);
    app.use(errorHandler);
}

startServer();

module.exports = app;