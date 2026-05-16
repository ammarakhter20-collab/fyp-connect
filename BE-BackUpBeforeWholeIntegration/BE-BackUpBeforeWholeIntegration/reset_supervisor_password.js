const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function resetSupervisorPassword() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        const genUsersCollection = mongoose.connection.collection('genusers');

        // Find the supervisor with email ammar@example.com
        const supervisor = await genUsersCollection.findOne({
            email: 'ammar@example.com',
            role: 'faculty'
        });

        if (!supervisor) {
            console.log("❌ Supervisor not found with email: ammar@example.com");
            await mongoose.disconnect();
            return;
        }

        console.log(`Found supervisor: ${supervisor.name}`);
        console.log(`Email: ${supervisor.email}`);
        console.log(`Faculty ID: ${supervisor.facultyId}`);

        // Hash the new password
        const newPassword = 'password123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password
        const result = await genUsersCollection.updateOne(
            { _id: supervisor._id },
            { $set: { password: hashedPassword } }
        );

        if (result.modifiedCount > 0) {
            console.log("\n========================================");
            console.log("     ✓ PASSWORD RESET SUCCESSFUL!");
            console.log("========================================");
            console.log(`Name: ${supervisor.name}`);
            console.log(`Email: ${supervisor.email}`);
            console.log(`New Password: ${newPassword}`);
            console.log(`Faculty ID: ${supervisor.facultyId || 'N/A'}`);
            console.log("========================================\n");
            console.log("You can now login with these credentials!");
        } else {
            console.log("❌ Failed to update password");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

resetSupervisorPassword();
