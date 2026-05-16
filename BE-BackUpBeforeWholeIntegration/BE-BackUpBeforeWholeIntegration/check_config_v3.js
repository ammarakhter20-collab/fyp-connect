const mongoose = require('mongoose');
require('dotenv').config();

// Pre-load all models to avoid population issues
require('./server/models/AdminModels/fypTerm');
require('./server/models/CoordinatorModels/ExamTypeModel');
const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const exams = await CreateExam.find().populate('ExamType').populate('Term');
        console.log("--- Created Exams Detail ---");
        for (const ex of exams) {
            console.log(`ID: ${ex._id}`);
            console.log(`  Term: ${ex.Term?.sessionTerm || 'N/A'} (${ex.Term?._id})`);
            console.log(`  ExamType: ${ex.ExamType?.examName || 'UNDEFINED'} (${ex.ExamType?._id})`);
            if (ex.ExamType) {
                console.log(`  Role Required: ${ex.ExamType.examTypeFor}`);
            } else {
                // If undefined, let's see the raw value
                const raw = await mongoose.connection.db.collection('createexammodels').findOne({ _id: ex._id });
                console.log(`  Raw ExamType ID: ${raw.ExamType}`);
            }
        }

        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}

check();
