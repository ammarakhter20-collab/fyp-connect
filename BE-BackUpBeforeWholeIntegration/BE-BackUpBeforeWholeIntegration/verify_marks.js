const mongoose = require("mongoose");
require("dotenv").config();

// Define minimal schemas to read data
const TermSchema = new mongoose.Schema({
    termId: { type: mongoose.Schema.Types.ObjectId, ref: "FYPTerm" },
    exams: [new mongoose.Schema({
        examName: String,
        fypGroups: [new mongoose.Schema({
            students: [new mongoose.Schema({
                studentId: { type: mongoose.Schema.Types.ObjectId, ref: "GenUser" },
                marks: Number,
                obtainedAverage: Number
            }, { _id: false })]
        }, { _id: false })]
    }, { _id: false })]
}, { _id: false });

const EvaluationSchema = new mongoose.Schema({
    terms: [TermSchema]
});

const Evaluation = mongoose.model("Evaluation", EvaluationSchema);
const FYPTerm = mongoose.model("FYPTerm", new mongoose.Schema({ sessionTerm: String }));
const GenUser = mongoose.model("GenUser", new mongoose.Schema({ name: String, registrationNumber: String }));

const verifyMarks = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        const term = await FYPTerm.findOne({ sessionTerm: "231-1" });
        if (!term) throw new Error("Term 231-1 not found");

        const evaluations = await Evaluation.find({ "terms.termId": term._id });
        console.log(`Found ${evaluations.length} evaluations for Term 231-1`);

        evaluations.forEach((evaluation, index) => {
            console.log(`EVALUATION [${index}]: SupervisorId=${evaluation.supervisorId}`);
            const termData = evaluation.terms.find(t => t.termId.toString() === term._id.toString());
            const exam = termData.exams.find(e => e.examName === "Proposal");
            if (exam && exam.fypGroups.length > 0) {
                const group = exam.fypGroups[0];
                console.log(`  Proposal Group 1: Student Count = ${group.students.length}`);
                group.students.forEach((s, idx) => {
                    console.log(`    Student ${idx}: ID=${s.studentId}, Marks=${s.marks}, Avg=${s.obtainedAverage}`);
                });
            }
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyMarks();
