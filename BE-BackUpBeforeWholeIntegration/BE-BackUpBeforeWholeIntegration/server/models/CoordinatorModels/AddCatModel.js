const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the technology
const categorySchema = new Schema({
  category: {
    type: String,
    required: true,
  },
});

// Create the model for the technology
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
