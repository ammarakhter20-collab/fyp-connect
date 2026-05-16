const mongoose = require('mongoose');
require('dotenv').config();

async function createTestFYPRequest() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        // Get collections
        const genUsersCollection = mongoose.connection.collection('genusers');
        const technologiesCollection = mongoose.connection.collection('technologies');
        const platformsCollection = mongoose.connection.collection('platforms');
        const fypsCollection = mongoose.connection.collection('fyps');
        const fyptermsCollection = mongoose.connection.collection('fypterms');

        // Find a student
        const student = await genUsersCollection.findOne({ role: { $regex: /^student$/i } });
        if (!student) {
            console.log("❌ No students found in database");
            await mongoose.disconnect();
            return;
        }
        console.log(`✓ Found student: ${student.name} (${student.email})`);

        // Find a supervisor
        const supervisor = await genUsersCollection.findOne({ role: 'faculty' });
        if (!supervisor) {
            console.log("❌ No supervisors found in database");
            await mongoose.disconnect();
            return;
        }
        console.log(`✓ Found supervisor: ${supervisor.name} (${supervisor.email})`);

        // Find technology
        const technology = await technologiesCollection.findOne({});
        console.log(`✓ Found technology: ${technology ? technology.techName : 'None'}`);

        // Find platform
        const platform = await platformsCollection.findOne({});
        console.log(`✓ Found platform: ${platform ? platform.platformName : 'None'}`);

        // Find active term
        const term = await fyptermsCollection.findOne({ status: 'activated' });
        if (!term) {
            console.log("⚠️ No activated term found, using student's term");
        }
        const termId = term ? term._id : student.term;
        console.log(`✓ Using term: ${termId}`);

        // Create test FYP registration
        const testFYP = {
            groupMembers: [{
                _id: student._id,
                name: student.name,
                email: student.email,
                registrationNumber: student.registrationNumber,
                department: student.department,
                program: student.program,
                term: student.term
            }],
            selectedOption: supervisor._id,  // This is the supervisor
            selectedTechnology: technology ? technology._id : null,
            selectedPlatform: platform ? platform._id : null,
            topicData: {
                topic: "Test FYP Project - AI Chatbot",
                description: "A test FYP project for debugging purposes",
                category: "AI/ML"
            },
            reqStatus: "pending",
            user: student._id,
            term: termId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Insert into database
        const result = await fypsCollection.insertOne(testFYP);

        console.log("\n========================================");
        console.log("     ✓ TEST FYP REQUEST CREATED!");
        console.log("========================================");
        console.log(`FYP ID: ${result.insertedId}`);
        console.log(`Student: ${student.name} (${student.email})`);
        console.log(`Supervisor: ${supervisor.name} (${supervisor.email})`);
        console.log(`Status: pending`);
        console.log(`Topic: Test FYP Project - AI Chatbot`);
        console.log("\n========================================");
        console.log("     SUPERVISOR LOGIN CREDENTIALS");
        console.log("========================================");
        console.log(`Email: ${supervisor.email}`);
        console.log(`Password hint: If this is the test supervisor, use 'password123'`);
        console.log("========================================\n");

        // Verify it was saved
        const count = await fypsCollection.countDocuments();
        console.log(`Total FYP requests in database: ${count}`);

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

createTestFYPRequest();
