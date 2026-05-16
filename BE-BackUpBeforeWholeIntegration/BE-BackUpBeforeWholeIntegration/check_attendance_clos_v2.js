const mongoose = require('mongoose');
require('dotenv').config();

require('./server/models/CoordinatorModels/ExamTypeModel');
const CLOForExam = require('./server/models/CoordinatorModels/CLOForExamModel');
const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');
require('./server/models/CoordinatorModels/CLOsModel');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const exams = await CreateExam.find({}).populate('ExamType');

        for (const e of exams) {
            if (e.ExamType && e.ExamType.examName.includes('Attendance')) {
                console.log(`Exam: ${e.ExamType.examName}`);
                console.log(`  CLOForExams Raw: "${e.CLOForExams}"`);

                let containsCLO = false;
                if (e.CLOForExams) {
                    const cloDoc = await CLOForExam.findById(e.CLOForExams).populate("CLOs");
                    containsCLO = cloDoc && cloDoc.CLOs.length > 0;
                    console.log(`  CLO Doc Found: ${!!cloDoc}`);
                    if (cloDoc) {
                        console.log(`  Number of CLOs: ${cloDoc.CLOs.length}`);
                    }
                }
                console.log(`  Resulting containsCLO: ${containsCLO}`);
                console.log('-------------------');
            }
        }

        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}

check();
