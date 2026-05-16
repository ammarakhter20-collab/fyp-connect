const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const UserModel = mongoose.model("ExcelUser", userSchema);

module.exports = UserModel;
