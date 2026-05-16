const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../AdminModels/GenUserModel");

// Define the schema for the technology
const technologySchema = new Schema({
  techName: {
    type: String,
    required: true,
  },

  // Reference to the GenUserModal
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Create the model for the technology
const Technology = mongoose.model("Technology", technologySchema);

module.exports = Technology;
