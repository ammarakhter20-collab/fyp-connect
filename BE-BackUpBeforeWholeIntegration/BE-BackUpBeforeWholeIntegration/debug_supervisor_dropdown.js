const mongoose = require('mongoose');
require('dotenv').config();

async function debugSupervisorDropdown() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        const genUsersCollection = mongoose.connection.collection('genusers');

        // Find the student
        const student = await genUsersCollection.findOne({
            email: 'ammar32@example.com'
        });

        if (!student) {
            console.log("❌ Student not found");
            await mongoose.disconnect();
            return;
        }

        // Find all faculty
        const faculties = await genUsersCollection.find({ role: 'faculty' }).toArray();

        console.log(`========================================`);
        console.log(`   STUDENT (logged in user)`);
        console.log(`========================================`);
        console.log(`Name: ${student.name}`);
        console.log(`Email: ${student.email}`);
        console.log(`Department (raw): ${student.department}`);
        console.log(`Department type: ${typeof student.department}`);
        console.log(`Program (raw): ${student.program}`);
        console.log(`Program type: ${typeof student.program}\n`);

        console.log(`========================================`);
        console.log(`   FACULTY DATA (${faculties.length} total)`);
        console.log(`========================================\n`);

        faculties.forEach((fac, index) => {
            console.log(`${index + 1}. ${fac.name} (${fac.email})`);
            console.log(`   Department (raw): ${fac.department}`);
            console.log(`   Department type: ${typeof fac.department}`);
            console.log(`   Program (raw): ${fac.program}`);
            console.log(`   Program type: ${typeof fac.program}`);

            // Simulate the frontend filtering logic
            const hasDept = !!fac.department;
            const hasProg = !!fac.program;

            if (hasDept && hasProg) {
                const facDeptId = fac.department?._id || fac.department;
                const facProgId = fac.program?._id || fac.program;
                const userDeptId = student.department?._id || student.department;
                const userProgId = student.program?._id || student.program;

                const deptMatch = String(facDeptId) === String(userDeptId);
                const progMatch = String(facProgId) === String(userProgId);

                console.log(`   Dept Match: ${deptMatch ? '✓' : '❌'} (${facDeptId} === ${userDeptId})`);
                console.log(`   Prog Match: ${progMatch ? '✓' : '❌'} (${facProgId} === ${userProgId})`);
                console.log(`   WILL SHOW: ${deptMatch && progMatch ? '✓ YES' : '❌ NO'}`);
            } else {
                console.log(`   ❌ Missing ${!hasDept ? 'Department' : ''} ${!hasProg ? 'Program' : ''}`);
                console.log(`   WILL SHOW: ❌ NO`);
            }
            console.log('');
        });

        console.log(`========================================`);
        console.log(`   ACTION REQUIRED`);
        console.log(`========================================`);
        console.log(`1. Open browser console (F12)`);
        console.log(`2. Type: localStorage.removeItem('allFacultyData')`);
        console.log(`3. Press Enter`);
        console.log(`4. Refresh the page`);
        console.log(`========================================\n`);

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

debugSupervisorDropdown();
