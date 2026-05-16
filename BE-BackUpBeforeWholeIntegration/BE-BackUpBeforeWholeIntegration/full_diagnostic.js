const mongoose = require('mongoose');
require('dotenv').config();

async function fullDiagnostic() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        const fypsCollection = mongoose.connection.collection('fyps');
        const genUsersCollection = mongoose.connection.collection('genusers');

        // Get supervisor
        const supervisor = await genUsersCollection.findOne({
            email: 'ammar@example.com',
            role: 'faculty'
        });

        console.log(`SUPERVISOR: ${supervisor.name} (${supervisor._id})\n`);

        // Get ALL FYP requests with full details
        const requests = await fypsCollection.find({}).toArray();

        console.log(`========================================`);
        console.log(`DATABASE HAS ${requests.length} FYP REQUEST(S)`);
        console.log(`========================================\n`);

        if (requests.length === 0) {
            console.log("❌ DATABASE IS EMPTY - Registration didn't save!");
            console.log("\nCheck:");
            console.log("1. Did you clear localStorage.removeItem('allFacultyData')?");
            console.log("2. Did student actually submit the form?");
            console.log("3. Check browser console for errors");
            await mongoose.disconnect();
            return;
        }

        for (let i = 0; i < requests.length; i++) {
            const req = requests[i];
            console.log(`--- REQUEST ${i + 1} ---`);
            console.log(`ID: ${req._id}`);
            console.log(`Topic: ${req.topicData?.topic || 'N/A'}`);
            console.log(`Status: ${req.reqStatus}`);
            console.log(`Supervisor ID in DB: ${req.selectedOption}`);
            console.log(`Supervisor ID expected: ${supervisor._id}`);
            console.log(`Type of DB value: ${typeof req.selectedOption}`);
            console.log(`Type of expected value: ${typeof supervisor._id}`);

            // Try different comparison methods
            const match1 = req.selectedOption === supervisor._id;
            const match2 = String(req.selectedOption) === String(supervisor._id);
            const match3 = req.selectedOption?.toString() === supervisor._id.toString();

            console.log(`Strict match (===): ${match1}`);
            console.log(`String match: ${match2}`);
            console.log(`toString match: ${match3}`);
            console.log(`WILL SHOW TO SUPERVISOR: ${match2 ? '✓ YES' : '❌ NO'}`);
            console.log('');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

fullDiagnostic();
