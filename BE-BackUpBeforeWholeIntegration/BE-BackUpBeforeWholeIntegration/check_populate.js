const mongoose = require('mongoose');
require('dotenv').config();

async function checkPopulateIssue() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        const fypsCollection = mongoose.connection.collection('fyps');
        const genUsersCollection = mongoose.connection.collection('genusers');

        // Get all FYP requests
        const requests = await fypsCollection.find({}).toArray();

        console.log(`===========================================`);
        console.log(`   POPULATE DIAGNOSTIC`);
        console.log(`===========================================\n`);

        for (const req of requests) {
            console.log(`FYP Request ID: ${req._id}`);
            console.log(`Supervisor ID stored: ${req.selectedOption}`);
            console.log(`Type: ${typeof req.selectedOption}`);

            // Try to find the user
            let user = null;
            try {
                if (typeof req.selectedOption === 'string') {
                    user = await genUsersCollection.findOne({
                        _id: new mongoose.Types.ObjectId(req.selectedOption)
                    });
                } else if (req.selectedOption) {
                    user = await genUsersCollection.findOne({
                        _id: req.selectedOption
                    });
                }
            } catch (e) {
                console.log(`ERROR looking up user: ${e.message}`);
            }

            if (user) {
                console.log(`✓ User FOUND: ${user.name} (${user.email})`);
            } else {
                console.log(`❌ User NOT FOUND - This causes populate to return null!`);
                console.log(`\nThis is why the supervisor can't see the request!`);
                console.log(`The ID ${req.selectedOption} doesn't exist in genusers collection\n`);
            }
            console.log('---\n');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

checkPopulateIssue();
