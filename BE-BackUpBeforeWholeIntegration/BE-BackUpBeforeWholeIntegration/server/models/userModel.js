const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  regno: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  cgpa: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Assuming you store the file path or URL to the profile picture
    required: true, // Adjust this based on your requirements
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);
