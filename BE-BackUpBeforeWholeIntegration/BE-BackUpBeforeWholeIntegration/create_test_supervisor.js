const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Define schema minimally
const genUserSchema = new mongoose.Schema({}, { strict: false });
const GenUser = mongoose.model('GenUser', genUserSchema);

async function createTestSupervisor() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        // Check if test supervisor already exists
        const existing = await GenUser.findOne({ email: 'testsupervisor@test.com' });

        if (existing) {
            console.log("Test supervisor already exists:");
            console.log("Email: testsupervisor@test.com");
            console.log("Password: password123");
            console.log("\nYou can log in with these credentials.\n");
        } else {
            // Find an existing student to get their term, department, program
            const student = await GenUser.findOne({ role: { $regex: /^student$/i } });

            if (!student) {
                console.log("No students found to reference. Please provide term, department, program IDs.");
                await mongoose.disconnect();
                return;
            }

            // Create test supervisor
            const hashedPassword = await bcrypt.hash('password123', 10);

            const testSupervisor = await GenUser.create({
                name: 'Test Supervisor',
                email: 'testsupervisor@test.com',
                password: hashedPassword,
                role: 'faculty',
                facultyId: 'TEST-SUP-001',
                designation: 'Lecturer',
                department: student.department,
                program: student.program,
                phoneNumber: '0300-1234567'
            });

            console.log("✓ Test supervisor created successfully!");
            console.log("\n=== Login Credentials ===");
            console.log("Email: testsupervisor@test.com");
            console.log("Password: password123");
            console.log("\n=== Details ===");
            console.log(`Name: ${testSupervisor.name}`);
            console.log(`Faculty ID: ${testSupervisor.facultyId}`);
            console.log(`ID: ${testSupervisor._id}`);
            console.log("\nYou can now log in as this supervisor!\n");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

createTestSupervisor();
