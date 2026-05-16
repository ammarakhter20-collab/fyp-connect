const mongoose = require('mongoose');
require('dotenv').config();

require('./server/models/CoordinatorModels/CLOsModel');
const CLOForExam = require('./server/models/CoordinatorModels/CLOForExamModel');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const id = '697ba286600a5b543e2cc3155'.trim();
        const clo = await CLOForExam.findById(id).populate({
            path: 'cloEvaluations.cloId',
            model: 'ManageCLO'
        });

        // Populate the top-level CLOs array if it exists
        const cloWithPopulatedCLOs = await CLOForExam.findById(id).populate('CLOs');

        console.log("CLOForExam Docs:", JSON.stringify(cloWithPopulatedCLOs, null, 2));
        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}

check();
