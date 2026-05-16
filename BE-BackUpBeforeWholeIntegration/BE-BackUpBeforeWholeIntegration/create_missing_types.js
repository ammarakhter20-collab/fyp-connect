const mongoose = require('mongoose');
require('dotenv').config();

const ExamType = require('./server/models/CoordinatorModels/ExamTypeModel');

async function createMissingTypes() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const required = [
            { name: 'Attendance-II', part: 'Student', code: 'ATT2' },
            { name: 'Mid-II', part: 'Student', code: 'MID2' },
            { name: 'Final-II', part: 'Student', code: 'FIN2' }
        ];

        for (const req of required) {
            const exists = await ExamType.findOne({ examName: req.name });
            if (!exists) {
                console.log(`Creating ${req.name}...`);
                const newType = new ExamType({
                    examName: req.name,
                    shortCode: req.code,
                    examTypeFor: req.part
                });
                await newType.save();
                console.log(`  Success: ${req.name}`);
            } else {
                console.log(`Exists: ${req.name}`);
            }
        }

        await mongoose.disconnect();
    } catch (e) {
        console.error("Error creating types:", e);
    }
}

createMissingTypes();
