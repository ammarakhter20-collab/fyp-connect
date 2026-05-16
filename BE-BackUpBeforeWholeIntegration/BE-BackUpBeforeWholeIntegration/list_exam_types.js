const mongoose = require('mongoose');
require('dotenv').config();
const ExamType = require('./server/models/CoordinatorModels/ExamTypeModel');

async function listExamTypes() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB.");

        const types = await ExamType.find({});
        console.log("Exam Types found:", types.length);
        console.log(JSON.stringify(types.map(t => ({
            _id: t._id,
            name: t.examName,
            for: t.examTypeFor
        })), null, 2));

        await mongoose.disconnect();
    } catch (e) {
        console.error("Error:", e);
    }
}

listExamTypes();
