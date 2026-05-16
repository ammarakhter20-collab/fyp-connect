const mongoose = require('mongoose');
require('dotenv').config();

const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');
const ExamType = require('./server/models/CoordinatorModels/ExamTypeModel');
require('./server/models/AdminModels/fypTerm');


async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const exams = await CreateExam.find().populate('ExamType').populate('Term');
        console.log("--- Created Exams ---");
        exams.forEach(ex => {
            console.log(`Exam: ${ex.ExamType?.examName}, Role: ${ex.ExamType?.examTypeFor}, Term: ${ex.Term?.sessionTerm}`);
        });

        // Check specifically for Attendance exam types
        const attendanceTypes = await ExamType.find({ examName: /Attendance/i });
        console.log("--- Attendance Exam Types ---");
        attendanceTypes.forEach(t => console.log(`ID: ${t._id}, Name: ${t.examName}, Role: ${t.examTypeFor}`));

        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}

check();
