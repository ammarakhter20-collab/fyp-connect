const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../AdminModels/GenUserModel");

// Define the schema for the technology
const platformSchema = new Schema({
  platformName: {
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
const Technology = mongoose.model("Platform", platformSchema);

module.exports = Technology;
