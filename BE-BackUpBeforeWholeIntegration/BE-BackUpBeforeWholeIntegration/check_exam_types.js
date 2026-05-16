const mongoose = require('mongoose');
require('dotenv').config();

const ExamType = require('./server/models/CoordinatorModels/ExamTypeModel');

async function checkAndFixTypes() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const types = await ExamType.find({});
        const existingNames = types.map(t => t.examName);
        console.log("Existing Exam Types:", existingNames);

        types.forEach(t => {
            console.log(`Type: ${t.examName}, Code: ${t.shortCode}, For: ${t.examTypeFor}`);
        });

        const required = [
            'Proposal', 'Attendance-I', 'Mid-I', 'Final-I',
            'Attendance-II', 'Mid-II', 'Final-II'
        ];

        for (const name of required) {
            if (!existingNames.includes(name)) {
                console.log(`Missing ExamType: ${name}, creating...`);

                let code = name.toUpperCase().substring(0, 3);
                if (name.includes('Attendance')) code = name.includes('-I') ? 'ATT1' : 'ATT2';
                else if (name.includes('Mid')) code = name.includes('-I') ? 'MID1' : 'MID2';
                else if (name.includes('Final')) code = name.includes('-I') ? 'FIN1' : 'FIN2';
                else if (name.includes('Proposal')) code = 'PROP';

                // Ensure unique code if simple substring is dup
                // Just use random suffix if needed, but these standard ones should work.

                // Note: examTypeFor enum in schema says: ["All", "Supervisor", "Coordinator", "Student"]
                // But previous code referred to 'part-I'?? 
                // Let's use 'All' or 'Student' to be safe with schema, 
                // OR checking existing types to see what they use.
                // Assuming "part-I" / "part-II" was used in CONTROLLER logic for FILTERING, 
                // but strictly the model forbids it if enum is enforced. 
                // Wait, Mongoose Enums are strict by default.
                // If existing types have 'part-I', the schema file might be out of sync with DB or validation is disabled?
                // I will use 'Student' as a safe default if I don't see others.

                const newType = new ExamType({
                    examName: name,
                    shortCode: code,
                    examTypeFor: 'part-I' // Try this first? NO, schema says enum.
                    // But wait, the controller logic explicitly filters by `examTypeFor === 'part-I'`.
                    // This implies the Schema definition I read might be WRONG or outdated compared to what's in use,
                    // OR the controller logic is wrong.
                    // Let's safe-bet: Use 'part-I'/'part-II' ONLY IF I see it in existing types.
                    // Otherwise use 'Student'.
                    // Actually, I'll let the script PRINT existing types first.
                });

                // I'll defer creation until I see the log of existing types in the first run.
                // Re-writing this script to JUST LOG for now to be sure.
            }
        }

        await mongoose.disconnect();
    } catch (e) {
        console.log("Error:", e.message);
    }
}

async function createMissing(name) {
    // This function will be called manually or in next step
    // Just putting placeholder here
}

checkAndFixTypes();
