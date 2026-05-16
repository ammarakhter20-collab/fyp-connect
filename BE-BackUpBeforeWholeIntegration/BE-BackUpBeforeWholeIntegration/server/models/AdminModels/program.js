const mongoose = require("mongoose");
const Department = require("./department");
const FYPTerm = require("./fypTerm");
const ProgramSchema = new mongoose.Schema({
  programTitle: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  // term: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "FYPTerm",
  //   required: true,
  // },
});

const Program = mongoose.model("Program", ProgramSchema);

module.exports = Program;
