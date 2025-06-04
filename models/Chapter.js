const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  class: { type: String, required: true },
  unit: { type: String, required: true },
  chapter: { type: String, required: true },
  subject: { type: String, required: true },
  status: { type: String, required: true },
  isWeakChapter: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Chapter", chapterSchema);
