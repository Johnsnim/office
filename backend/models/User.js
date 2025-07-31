const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  userName: String,
  password: String,
  role: String,
});

module.exports = mongoose.model("User", userSchema);
