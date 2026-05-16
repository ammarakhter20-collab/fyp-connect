const mongoose = require('mongoose');
require('dotenv').config();

async function checkSupervisorData() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        const genUsersCollection = mongoose.connection.collection('genusers');

        // Find all supervisors
        const supervisors = await genUsersCollection.find({ role: 'faculty' }).toArray();

        console.log(`========================================`);
        console.log(`   Found ${supervisors.length} Supervisor(s)`);
        console.log(`========================================\n`);

        supervisors.forEach((sup, index) => {
            console.log(`${index + 1}. ${sup.name}`);
            console.log(`   Email: ${sup.email}`);
            console.log(`   Department: ${sup.department || 'MISSING!'}`);
            console.log(`   Program: ${sup.program || 'MISSING!'}`);
            console.log(`   Faculty ID: ${sup.facultyId || 'N/A'}`);
            console.log('');
        });

        // Check if any supervisors are missing department or program
        const withoutDept = supervisors.filter(s => !s.department);
        const withoutProg = supervisors.filter(s => !s.program);

        if (withoutDept.length > 0) {
            console.log(`⚠️  ${withoutDept.length} supervisor(s) missing DEPARTMENT`);
        }
        if (withoutProg.length > 0) {
            console.log(`⚠️  ${withoutProg.length} supervisor(s) missing PROGRAM`);
        }

        if (withoutDept.length === 0 && withoutProg.length === 0) {
            console.log("✓ All supervisors have department and program set");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

checkSupervisorData();
