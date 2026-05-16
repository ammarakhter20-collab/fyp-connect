const mongoose = require('mongoose');
require('dotenv').config();

require('./server/models/CoordinatorModels/ExamTypeModel');
require('./server/models/CoordinatorModels/CLOForExamModel');
const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const exams = await CreateExam.find({}).populate('ExamType');

        exams.filter(e => e.ExamType && e.ExamType.examName.includes('Attendance')).forEach(e => {
            console.log(`Exam: ${e.ExamType.examName}`);
            console.log(`  CLOForExams: ${e.CLOForExams}`);
            console.log(`  ExamWeightage: ${e.ExamWeightage}`);
        });

        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}

check();
