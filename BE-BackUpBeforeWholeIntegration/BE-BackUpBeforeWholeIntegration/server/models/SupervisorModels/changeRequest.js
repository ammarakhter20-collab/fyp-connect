const mongoose = require("mongoose");
const User = require("../AdminModels/GenUserModel");
const FypRegistration = require("../StudentModels/fypRegModel");
const Schema = mongoose.Schema;

const fypChangeRequestSchema = new Schema({
  fypGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FypRegistration",
    required: true,
  },
  changeData: {
    type: {
      topic: String,
      desc: String,
      technology: String,
      platform: String,
      category: String,
    },
    required: true,
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FypChangeRequest", fypChangeRequestSchema);
