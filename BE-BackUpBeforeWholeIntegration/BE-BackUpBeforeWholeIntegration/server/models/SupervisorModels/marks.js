// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const marksSchema = new Schema({
//   task: {
//     type: Schema.Types.ObjectId,
//     ref: "Task",
//     required: true,
//   },
//   groupId: {
//     type: String,
//     required: true,
//   },
//   examiner: {
//     type: Schema.Types.ObjectId,
//     ref: "GenUser",
//     required: true,
//   },
//   marks: [
//     {
//       student: {
//         type: Schema.Types.ObjectId,
//         ref: "GenUser",
//         required: true,
//       },
//       obtainedMarks: {
//         type: Number,
//         required: true,
//       },
//       totalMarks: {
//         type: Number,
//         // required: true
//       },
//     },
//   ],
//   partStatus: {
//     type: String,
//   },
//   taskFeedbback: {
//     type: String,
//   },
//   // fypGroup: {type: Schema.Types.ObjectId,
//   // ref: 'FypRegistration',
//   // required: true,
//   // }
// });

// const Marks = mongoose.model("Mark", marksSchema);

// module.exports = Marks;
