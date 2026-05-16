const mongoose = require("mongoose");
// const FYPTerm = require("./fypTerm");

const DepartmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: false,
  },

  // term: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "FYPTerm",
  //   required: true,
  // },
});

const Department = mongoose.model("Department", DepartmentSchema);

module.exports = Department;
