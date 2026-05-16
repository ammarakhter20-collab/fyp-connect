const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

async function saveStudentCredentials() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        const genUsersCollection = mongoose.connection.collection('genusers');

        // Find all students
        const students = await genUsersCollection.find({
            role: { $regex: /^student$/i }
        }).toArray();

        let output = '';
        output += `========================================\n`;
        output += `   STUDENT LOGIN CREDENTIALS\n`;
        output += `   Total Students: ${students.length}\n`;
        output += `========================================\n\n`;
        output += `All student passwords have been reset to: password123\n\n`;
        output += `========================================\n\n`;

        students.forEach((student, index) => {
            output += `${index + 1}. ${student.name}\n`;
            output += `   Email: ${student.email}\n`;
            output += `   Password: password123\n`;
            output += `   Registration #: ${student.registrationNumber || 'N/A'}\n`;
            output += `   ID: ${student._id}\n`;
            output += `\n`;
        });

        output += `========================================\n`;
        output += `   HOW TO LOGIN\n`;
        output += `========================================\n`;
        output += `1. Go to the login page\n`;
        output += `2. Enter any student email from above\n`;
        output += `3. Password: password123\n`;
        output += `4. Click Login\n`;
        output += `========================================\n`;

        console.log(output);

        fs.writeFileSync('student_credentials.txt', output);
        console.log('\n✓ Student credentials saved to student_credentials.txt\n');

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

saveStudentCredentials();
