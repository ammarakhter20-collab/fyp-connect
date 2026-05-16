const mongoose = require("mongoose");

const PercentageSchema = new mongoose.Schema({
  term: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FYPTerm",
    required: true,
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
    required: true,
  },
  supervisorPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

const SupervisorPercentage = mongoose.model(
  "SupervisorPercentage",
  PercentageSchema
);

module.exports = SupervisorPercentage;
