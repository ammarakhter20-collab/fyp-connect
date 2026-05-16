const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const examMarksSchema = new Schema({
  exam: {
    type: Schema.Types.ObjectId,
    ref: "ExamAssignment",
    required: true,
  },
  examiners: [
    {
      examiner: {
        type: Schema.Types.ObjectId,
        ref: "GenUser",
        required: true,
      },
      marks: [
        {
          student: {
            type: Schema.Types.ObjectId,
            ref: "GenUser",
            required: true,
          },
          obtainedMarks: {
            type: Number,
            required: true,
          },
          totalMarks: {
            type: Number,
            // required: true
          },
        },
      ],
      feedback: {
        type: String,
      },
    },
  ],
  partStatus: {
    type: String,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: "FypRegistration",
    required: true,
  },
});

const ExamMarks = mongoose.model("ExamMarks", examMarksSchema);

module.exports = ExamMarks;
