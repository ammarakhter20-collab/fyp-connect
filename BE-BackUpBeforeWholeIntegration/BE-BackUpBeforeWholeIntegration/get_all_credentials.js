const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

async function getAllUserCredentials() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        const genUsersCollection = mongoose.connection.collection('genusers');

        // Get all users
        const allUsers = await genUsersCollection.find({}).toArray();

        let output = '';
        output += `========================================\n`;
        output += `   TOTAL USERS IN SYSTEM: ${allUsers.length}\n`;
        output += `========================================\n\n`;

        // Group by role
        const roles = ['admin', 'student', 'faculty', 'coordinator', 'hod'];

        for (const roleFilter of roles) {
            const usersInRole = allUsers.filter(u => u.role && u.role.toLowerCase() === roleFilter.toLowerCase());

            if (usersInRole.length > 0) {
                output += `\n${'='.repeat(60)}\n`;
                output += `   ${roleFilter.toUpperCase()} ACCOUNTS (${usersInRole.length})\n`;
                output += `${'='.repeat(60)}\n`;

                usersInRole.forEach((user, index) => {
                    output += `\n${index + 1}. ${user.name || 'N/A'}\n`;
                    output += `   Email: ${user.email}\n`;
                    output += `   Password (hashed): ${user.password}\n`;
                    output += `   Registration Number: ${user.registrationNumber || 'N/A'}\n`;
                    output += `   Faculty ID: ${user.facultyId || 'N/A'}\n`;
                    output += `   Role: ${user.role}\n`;
                    output += `   Database ID: ${user._id}\n`;
                });
            }
        }

        output += `\n\n${'='.repeat(60)}\n`;
        output += `   ⚠️  PASSWORD NOTE\n`;
        output += `${'='.repeat(60)}\n`;
        output += `Passwords shown above are HASHED with bcrypt.\n`;
        output += `They CANNOT be reversed to plain text.\n`;
        output += `\nFor testing, try these common passwords:\n`;
        output += `  - password123\n`;
        output += `  - Password123\n`;
        output += `  - 123456\n`;
        output += `\nTest Accounts Created:\n`;
        output += `  - testsupervisor@test.com / password123\n`;
        output += `${'='.repeat(60)}\n`;

        // Print to console
        console.log(output);

        // Save to file
        fs.writeFileSync('user_credentials.txt', output);
        console.log('\n✓ Credentials saved to user_credentials.txt\n');

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

getAllUserCredentials();
