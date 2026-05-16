const mongoose = require('mongoose');
require('dotenv').config();

async function checkRecentFYPRequests() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        const fypsCollection = mongoose.connection.collection('fyps');
        const genUsersCollection = mongoose.connection.collection('genusers');

        // Get all FYP requests, sorted by most recent
        const allRequests = await fypsCollection.find({}).sort({ createdAt: -1 }).toArray();

        console.log(`========================================`);
        console.log(`   TOTAL FYP REQUESTS: ${allRequests.length}`);
        console.log(`========================================\n`);

        if (allRequests.length === 0) {
            console.log("❌ NO FYP REQUESTS FOUND IN DATABASE!");
            console.log("\nThis means the student's registration was NOT saved.");
            console.log("Possible causes:");
            console.log("1. Form submission failed silently");
            console.log("2. Backend error prevented saving");
            console.log("3. Page refreshed before save completed");
            await mongoose.disconnect();
            return;
        }

        // Show all requests with supervisor details
        for (let i = 0; i < allRequests.length; i++) {
            const req = allRequests[i];
            console.log(`\n${'='.repeat(60)}`);
            console.log(`REQUEST ${i + 1} (${req.reqStatus || 'pending'})`);
            console.log(`${'='.repeat(60)}`);
            console.log(`FYP ID: ${req._id}`);
            console.log(`Status: ${req.reqStatus || 'pending'}`);
            console.log(`Topic: ${req.topicData?.topic || 'N/A'}`);
            console.log(`Supervisor ID: ${req.selectedOption}`);
            console.log(`Created: ${req.createdAt || 'N/A'}`);

            // Get supervisor details
            if (req.selectedOption) {
                const supervisor = await genUsersCollection.findOne({
                    _id: typeof req.selectedOption === 'string'
                        ? new mongoose.Types.ObjectId(req.selectedOption)
                        : req.selectedOption
                });

                if (supervisor) {
                    console.log(`\nSupervisor Details:`);
                    console.log(`  Name: ${supervisor.name}`);
                    console.log(`  Email: ${supervisor.email}`);
                    console.log(`  Role: ${supervisor.role}`);
                } else {
                    console.log(`\n❌ SUPERVISOR NOT FOUND WITH ID: ${req.selectedOption}`);
                }
            } else {
                console.log(`\n❌ NO SUPERVISOR ASSIGNED!`);
            }
        }

        console.log(`\n\n${'='.repeat(60)}`);
        console.log(`   VERIFICATION STEPS`);
        console.log(`${'='.repeat(60)}`);
        console.log(`1. Check if supervisor email matches above`);
        console.log(`2. Verify supervisor is logging in with correct email`);
        console.log(`3. Ensure supervisor's role is 'faculty'`);
        console.log(`4. Check if request status is 'pending'`);
        console.log(`${'='.repeat(60)}\n`);

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

checkRecentFYPRequests();
