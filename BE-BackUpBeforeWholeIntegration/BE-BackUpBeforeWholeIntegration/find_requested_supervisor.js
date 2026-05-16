const mongoose = require('mongoose');
require('dotenv').config();

async function findSubmittedRequest() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        // Access the fyps collection
        const fypsCollection = mongoose.connection.collection('fyps');

        // Find ALL FYP requests, sorted by most recent
        const allRequests = await fypsCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        console.log(`Total FYP requests in database: ${allRequests.length}\n`);

        if (allRequests.length === 0) {
            console.log("No FYP requests found. The submission might not have been saved yet.");
            console.log("Try refreshing the page or check if there were any errors during submission.\n");
            await mongoose.disconnect();
            return;
        }

        // Get the most recent request
        const recentRequest = allRequests[0];

        console.log("=== MOST RECENT FYP SUBMISSION ===");
        console.log(`Request ID: ${recentRequest._id}`);
        console.log(`Status: ${recentRequest.reqStatus || 'pending'}`);
        console.log(`Created: ${recentRequest.createdAt || 'N/A'}`);
        console.log(`Topic: ${recentRequest.topic || 'N/A'}`);
        console.log('');

        // The supervisor ID should be in selectedOption field
        const supervisorId = recentRequest.selectedOption;

        if (supervisorId) {
            console.log(`Supervisor ID: ${supervisorId}\n`);

            // Fetch supervisor details
            const genUsersCollection = mongoose.connection.collection('genusers');
            const supervisor = await genUsersCollection.findOne({
                _id: typeof supervisorId === 'string' ? new mongoose.Types.ObjectId(supervisorId) : supervisorId
            });

            if (supervisor) {
                console.log("========================================");
                console.log("     SUPERVISOR LOGIN CREDENTIALS");
                console.log("========================================");
                console.log(`Name: ${supervisor.name}`);
                console.log(`Email: ${supervisor.email}`);
                console.log(`Faculty ID: ${supervisor.facultyId || 'N/A'}`);
                console.log(`Role: ${supervisor.role}`);
                console.log('');
                console.log("⚠️  PASSWORD NOTE:");
                console.log("The password is encrypted in the database.");
                console.log("If you created this supervisor, use the password you set.");
                console.log("Common test passwords to try:");
                console.log("  - password123");
                console.log("  - Password123");
                console.log("  - 123456");
                console.log("========================================\n");
            } else {
                console.log("❌ Supervisor not found in database with that ID.\n");
            }
        } else {
            console.log("⚠️  No supervisor assigned to this request.\n");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

findSubmittedRequest();
