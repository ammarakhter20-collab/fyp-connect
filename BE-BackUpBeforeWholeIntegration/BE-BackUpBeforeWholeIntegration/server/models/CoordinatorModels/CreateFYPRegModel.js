const mongoose = require("mongoose");

const fypRegistrationSchema = new mongoose.Schema(
  {
    term: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FYPTerm",
      required: true,
    },
    announcementTitle: {
      type: String,
      required: true,
    },
    dueDateTime: {
      type: Date,
      required: true,
    },
    instructions: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Index for dueDateTime to optimize queries
fypRegistrationSchema.index({ dueDateTime: 1 });

module.exports = mongoose.model(
  "FYPRegistrationDeadline",
  fypRegistrationSchema
);
