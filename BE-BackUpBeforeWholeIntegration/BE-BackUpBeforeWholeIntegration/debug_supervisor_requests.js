const mongoose = require('mongoose');
require('dotenv').config();

async function debugSupervisorRequests() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        const fypsCollection = mongoose.connection.collection('fyps');
        const genUsersCollection = mongoose.connection.collection('genusers');

        // Get supervisor ammar's ID
        const supervisor = await genUsersCollection.findOne({
            email: 'ammar@example.com',
            role: 'faculty'
        });

        if (!supervisor) {
            console.log("❌ Supervisor not found");
            await mongoose.disconnect();
            return;
        }

        console.log(`========================================`);
        console.log(`   SUPERVISOR INFO`);
        console.log(`========================================`);
        console.log(`Name: ${supervisor.name}`);
        console.log(`Email: ${supervisor.email}`);
        console.log(`ID: ${supervisor._id}`);
        console.log(`Role: ${supervisor.role}\n`);

        // Get all FYP requests
        const allRequests = await fypsCollection.find({}).toArray();
        console.log(`Total FYP requests in database: ${allRequests.length}\n`);

        // Check which requests match this supervisor
        let matchingCount = 0;
        allRequests.forEach((req, index) => {
            const supervisorMatch = String(req.selectedOption) === String(supervisor._id);

            console.log(`Request ${index + 1}:`);
            console.log(`  ID: ${req._id}`);
            console.log(`  Status: ${req.reqStatus}`);
            console.log(`  Supervisor in request: ${req.selectedOption}`);
            console.log(`  Expected supervisor: ${supervisor._id}`);
            console.log(`  MATCH: ${supervisorMatch ? '✓ YES' : '❌ NO'}`);
            console.log('');

            if (supervisorMatch) matchingCount++;
        });

        console.log(`========================================`);
        console.log(`   RESULT`);
        console.log(`========================================`);
        console.log(`Requests matching supervisor: ${matchingCount}/${allRequests.length}`);

        if (matchingCount === 0) {
            console.log(`\n⚠️  NO REQUESTS MATCH THIS SUPERVISOR!`);
            console.log(`\nPossible causes:`);
            console.log(`1. Student selected a different supervisor`);
            console.log(`2. Supervisor ID mismatch`);
            console.log(`3. Frontend cached old supervisor list`);
        } else {
            console.log(`\n✓ ${matchingCount} request(s) should appear in supervisor's view`);
            console.log(`\nIf supervisor still can't see them, check:`);
            console.log(`1. Supervisor logged in with correct email`);
            console.log(`2. Frontend cleared cached data`);
            console.log(`3. Backend filtering logic`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

debugSupervisorRequests();
