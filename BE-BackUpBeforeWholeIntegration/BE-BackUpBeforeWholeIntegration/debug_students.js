const axios = require('axios');

async function testFetchStudents() {
    try {
        // We need a valid token. Since we don't have one easily, 
        // we'll try to hit the endpoint. verification relies on if it returns 200 or 401.
        // However, the backend might require auth.
        // Let's try to login first to get a token.

        // NOTE: I need a valid email/password to login. 
        // I see 'Genlogin' uses email/password.
        // I don't have credentials. 
        // BUT, I can inspect the backend code to see if I can bypass it or use a test user.
        // Or I can temporarily disable auth middleware for that route to test, or just look at the DB directly if I could (I can't directly).

        // Alternative: Create a script that connects to Mongoose directly and queries the DB
        // using the SAME query as the controller.

        const mongoose = require('mongoose');
        require('dotenv').config({ path: 'd:/FYP/FYP PORTAL CODE/BE-BackUpBeforeWholeIntegration/BE-BackUpBeforeWholeIntegration/.env' });

        // Define schema minimally
        const genUserSchema = new mongoose.Schema({ role: String }, { strict: false });
        const GenUser = mongoose.model('GenUser', genUserSchema);

        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        // Test the regex query
        const students = await GenUser.find({ role: { $regex: /^student$/i } });
        console.log(`Found ${students.length} students with regex /^student$/i`);
        if (students.length > 0) {
            console.log("Sample student:", JSON.stringify(students[0], null, 2));
        }

        // Test the exact match query (original code)
        const exactStudents = await GenUser.find({ role: "Student" });
        console.log(`Found ${exactStudents.length} students with role 'Student'`);

        // Test lowercase match
        const lowerStudents = await GenUser.find({ role: "student" });
        console.log(`Found ${lowerStudents.length} students with role 'student'`);

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

testFetchStudents();
