const mongoose = require('mongoose');
require('dotenv').config();

const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');
const ExamType = require('./server/models/CoordinatorModels/ExamTypeModel');
const FYPTerm = require('./server/models/AdminModels/fypTerm');

async function repair() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        // 1. Get correct ExamTypes
        const types = await ExamType.find({});
        const typeMap = {}; // Name -> ID
        types.forEach(t => typeMap[t.examName] = t._id);
        console.log("ExamTypes:", Object.keys(typeMap));

        // 2. Get active CreateExams
        const exams = await CreateExam.find({}).populate('ExamType');
        const validExams = {}; // Name -> CreateExamDoc
        const brokenExams = [];

        exams.forEach(e => {
            if (e.ExamType && e.ExamType.examName) {
                validExams[e.ExamType.examName] = e;
            } else {
                brokenExams.push(e);
            }
        });

        console.log("Valid Exams:", Object.keys(validExams));
        console.log("Broken Exams Count:", brokenExams.length);

        const needed = [
            'Proposal', 'Attendance-I', 'Mid-I', 'Final-I',
            'Attendance-II', 'Mid-II', 'Final-II'
        ];
        const termId = "697b64c756273c082e9eba85"; // Term 121

        for (const name of needed) {
            if (validExams[name]) {
                console.log(`OK: ${name} exists.`);
                continue;
            }

            console.log(`MISSING/BROKEN: ${name}`);

            // Try to reuse a broken exam based on weight
            let targetWeight = 0;
            if (name === 'Mid-I' || name === 'Mid-II') targetWeight = 10;
            else if (name === 'Final-I' || name === 'Final-II') targetWeight = 40; // Assuming 40 for Final-II as well? Or 30?
            // Wait, previous calc shows: Total I = 80.
            // Proposal(20) + Att(20) + Mid(10) + Final(30) = 80? No.
            // 20 + 20 + 10 = 50. Final must be 30 for 80 total? Or 50?
            // User complained 20+30+20+10 = 81 (or 80).
            // That implies Final is 30.

            if (name === 'Final-I' || name === 'Final-II') targetWeight = 30; // UPDATED to 30 based on user Calc
            else if (name === 'Proposal') targetWeight = 20;
            else if (name === 'Attendance-I' || name === 'Attendance-II') targetWeight = 20;

            // Find a broken exam with matching weight
            const candidateIndex = brokenExams.findIndex(b => b.ExamWeightage === targetWeight);

            if (candidateIndex !== -1) {
                const candidate = brokenExams[candidateIndex];
                console.log(`  Repairing broken exam ${candidate._id} (Weight ${candidate.ExamWeightage}) to be ${name}`);
                candidate.ExamType = typeMap[name];
                candidate.Term = termId; // Ensure term is correct
                await candidate.save();
                // Remove from broken list so we don't reuse it
                brokenExams.splice(candidateIndex, 1);
            } else {
                console.log(`  Creating NEW CreateExam for ${name} with weight ${targetWeight}`);
                const newExam = new CreateExam({
                    Term: termId,
                    ExamType: typeMap[name],
                    ExamWeightage: targetWeight,
                    AnnouncedDate: new Date(),
                    ReportDeadline: new Date()
                });
                await newExam.save();
            }
        }

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}
repair();
