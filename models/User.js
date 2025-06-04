const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

module.exports = mongoose.model("User", userSchema);
