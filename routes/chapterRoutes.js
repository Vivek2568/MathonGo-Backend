const express = require("express");
const router = express.Router();
const controller = require("../controllers/chapterController");
const auth = require("../middlewares/auth");

router.get("/", controller.getAllChapters);
router.get("/:id", controller.getChapterById);
router.post("/", auth, controller.uploadChapters);

module.exports = router;
