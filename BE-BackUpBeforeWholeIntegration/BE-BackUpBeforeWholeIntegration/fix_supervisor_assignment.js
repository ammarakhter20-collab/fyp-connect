const mongoose = require('mongoose');
require('dotenv').config();

async function updateSupervisorToMatchStudent() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        const genUsersCollection = mongoose.connection.collection('genusers');

        // Find a student to get their department and program
        const student = await genUsersCollection.findOne({
            role: { $regex: /^student$/i }
        });

        if (!student) {
            console.log("❌ No students found");
            await mongoose.disconnect();
            return;
        }

        console.log(`Student found: ${student.name}`);
        console.log(`Department ID: ${student.department}`);
        console.log(`Program ID: ${student.program}\n`);

        // Find the supervisor (ammar@example.com)
        const supervisor = await genUsersCollection.findOne({
            email: 'ammar@example.com',
            role: 'faculty'
        });

        if (!supervisor) {
            console.log("❌ Supervisor not found");
            await mongoose.disconnect();
            return;
        }

        console.log(`Supervisor found: ${supervisor.name}`);
        console.log(`Current Department: ${supervisor.department}`);
        console.log(`Current Program: ${supervisor.program}\n`);

        // Update supervisor to match student's department and program
        const result = await genUsersCollection.updateOne(
            { _id: supervisor._id },
            {
                $set: {
                    department: student.department,
                    program: student.program
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log("========================================");
            console.log("     ✓ SUPERVISOR UPDATED!");
            console.log("========================================");
            console.log(`Supervisor: ${supervisor.name}`);
            console.log(`Email: ${supervisor.email}`);
            console.log(`New Department ID: ${student.department}`);
            console.log(`New Program ID: ${student.program}`);
            console.log("========================================\n");
            console.log("✓ Supervisor will now appear in the FYP registration dropdown!");
        } else {
            console.log("ℹ️  No changes needed (already matching)");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

updateSupervisorToMatchStudent();
