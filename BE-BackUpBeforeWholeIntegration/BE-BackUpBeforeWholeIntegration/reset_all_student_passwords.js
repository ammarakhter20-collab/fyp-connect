const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function resetAllStudentPasswords() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        const genUsersCollection = mongoose.connection.collection('genusers');

        // Find all students
        const students = await genUsersCollection.find({
            role: { $regex: /^student$/i }
        }).toArray();

        if (students.length === 0) {
            console.log("❌ No students found");
            await mongoose.disconnect();
            return;
        }

        console.log(`========================================`);
        console.log(`   Found ${students.length} Student(s)`);
        console.log(`========================================\n`);

        // Hash the new password
        const newPassword = 'password123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update each student and display info
        for (let i = 0; i < students.length; i++) {
            const student = students[i];

            await genUsersCollection.updateOne(
                { _id: student._id },
                { $set: { password: hashedPassword } }
            );

            console.log(`${i + 1}. ${student.name}`);
            console.log(`   Email: ${student.email}`);
            console.log(`   Registration #: ${student.registrationNumber || 'N/A'}`);
            console.log(`   Password: ${newPassword}`);
            console.log(`   Database ID: ${student._id}`);
            console.log('');
        }

        console.log(`========================================`);
        console.log(`   ✓ ALL PASSWORDS RESET!`);
        console.log(`========================================`);
        console.log(`Total students updated: ${students.length}`);
        console.log(`New password for all: ${newPassword}`);
        console.log(`========================================\n`);

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

resetAllStudentPasswords();
