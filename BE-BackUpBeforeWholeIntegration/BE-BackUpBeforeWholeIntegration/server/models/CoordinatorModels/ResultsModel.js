const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for parts
const PartSchema = new Schema({
    // Define the fields you need in each part here
    // For example, if each part has marks or other details, define them
    examId: { type: Schema.Types.ObjectId, ref: 'CreateExamModel', required: true },
    marks: Number,
    resultStatus: {
        type: String,
        enum: ['P', 'F'],
        required: true,
    }
});

// Define the schema for student results
const StudentResultSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'GenUser', required: true },
    part_1: {PartSchema},
    part_2: {PartSchema},
});

// Define the schema for terms
const TermSchema = new Schema({
    termId: { type: Schema.Types.ObjectId, ref: 'FYPTerm', required: true },
    students: [StudentResultSchema],
});

// Define the main result schema
const ResultSchema = new Schema({
    terms: [TermSchema],
});

const Result = mongoose.model('Result', ResultSchema);

module.exports = Result;