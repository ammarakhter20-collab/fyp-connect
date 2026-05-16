const mongoose = require('mongoose');
require('dotenv').config();

async function compareSupervisorAndStudentData() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        const genUsersCollection = mongoose.connection.collection('genusers');

        // Find a student (use the one created most recently)
        const student = await genUsersCollection.findOne({
            role: { $regex: /^student$/i }
        });

        if (!student) {
            console.log("❌ No students found");
            await mongoose.disconnect();
            return;
        }

        console.log(`========================================`);
        console.log(`   STUDENT DATA`);
        console.log(`========================================`);
        console.log(`Name: ${student.name}`);
        console.log(`Email: ${student.email}`);
        console.log(`Department ID: ${student.department}`);
        console.log(`Program ID: ${student.program}`);
        console.log(`Term ID: ${student.term}\n`);

        // Find all supervisors
        const supervisors = await genUsersCollection.find({ role: 'faculty' }).toArray();

        console.log(`========================================`);
        console.log(`   SUPERVISORS (${supervisors.length})`);
        console.log(`========================================\n`);

        supervisors.forEach((sup, index) => {
            const deptMatch = String(sup.department) === String(student.department);
            const progMatch = String(sup.program) === String(student.program);
            const willShow = deptMatch && progMatch;

            console.log(`${index + 1}. ${sup.name}`);
            console.log(`   Email: ${sup.email}`);
            console.log(`   Department ID: ${sup.department}`);
            console.log(`   Program ID: ${sup.program}`);
            console.log(`   Department Match: ${deptMatch ? '✓ YES' : '❌ NO'}`);
            console.log(`   Program Match: ${progMatch ? '✓ YES' : '❌ NO'}`);
            console.log(`   WILL SHOW IN DROPDOWN: ${willShow ? '✓ YES' : '❌ NO'}`);
            console.log('');
        });

        const matchingSupervisors = supervisors.filter(s =>
            String(s.department) === String(student.department) &&
            String(s.program) === String(student.program)
        );

        console.log(`========================================`);
        console.log(`   RESULT`);
        console.log(`========================================`);
        console.log(`Total supervisors: ${supervisors.length}`);
        console.log(`Matching supervisors: ${matchingSupervisors.length}`);

        if (matchingSupervisors.length === 0) {
            console.log(`\n⚠️  NO SUPERVISORS MATCH THE STUDENT'S DEPARTMENT AND PROGRAM!`);
            console.log(`\nTo fix this, you need to:`);
            console.log(`1. Update the supervisor's department to: ${student.department}`);
            console.log(`2. Update the supervisor's program to: ${student.program}`);
        } else {
            console.log(`\n✓ ${matchingSupervisors.length} supervisor(s) will appear in the dropdown`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

compareSupervisorAndStudentData();
