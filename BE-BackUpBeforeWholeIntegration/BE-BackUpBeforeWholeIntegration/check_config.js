const mongoose = require('mongoose');
require('dotenv').config();

const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');
const ExamType = require('./server/models/CoordinatorModels/ExamTypeModel');
const GenUser = require('./server/models/AdminModels/GenUserModel');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        // 1. Check all ExamTypes
        const types = await ExamType.find({});
        console.log("--- Exam Types ---");
        types.forEach(t => console.log(`Name: ${t.examName}, Role: ${t.examTypeFor}`));

        // 2. Check the user 'ammar' (assuming this is the user)
        const user = await GenUser.findOne({ email: /ammar/i });
        if (user) {
            console.log("--- User Info ---");
            console.log(`Email: ${user.email}, Role: ${user.role}`);
        }

        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}

check();
