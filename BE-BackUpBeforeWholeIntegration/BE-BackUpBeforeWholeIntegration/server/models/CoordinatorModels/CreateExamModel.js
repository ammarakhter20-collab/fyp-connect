const mongoose = require("mongoose");

const CreateExamModelSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true,
  },
  // Add any other fields relevant to the exam
});

const CreateExamModel = mongoose.model(
  "CreateExamModel",
  CreateExamModelSchema
);

module.exports = CreateExamModel;
