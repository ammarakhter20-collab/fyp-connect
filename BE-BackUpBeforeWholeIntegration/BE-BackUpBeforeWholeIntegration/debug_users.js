const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/fyp";

const genUserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    registrationNumber: String
});

const GenUser = mongoose.model('GenUser', genUserSchema);

async function checkUsers() {
    try {
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB');

        const supervisors = await GenUser.find({ role: 'faculty' });
        console.log(`Found ${supervisors.length} supervisors.`);
        supervisors.forEach(s => console.log(`Supervisor: ${s.name} (${s._id})`));

        const students = await GenUser.find({ role: 'Student' });
        console.log(`Found ${students.length} students.`);
        students.forEach(s => console.log(`Student: ${s.name} (${s.registrationNumber})`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

checkUsers();
