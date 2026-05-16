const mongoose = require('mongoose');
require('dotenv').config();

async function findFYPCollections() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        // Get all collection names
        const collections = await mongoose.connection.db.listCollections().toArray();

        console.log("=== All Collections in Database ===");
        collections.forEach(col => {
            console.log(`- ${col.name}`);
        });
        console.log('');

        // Try to find FYP-related collections
        const fypCollections = collections.filter(col =>
            col.name.toLowerCase().includes('fyp') ||
            col.name.toLowerCase().includes('registration') ||
            col.name.toLowerCase().includes('request')
        );

        if (fypCollections.length > 0) {
            console.log("=== FYP-Related Collections ===");
            for (const col of fypCollections) {
                console.log(`\n--- ${col.name} ---`);
                const collectionData = mongoose.connection.collection(col.name);
                const count = await collectionData.countDocuments();
                console.log(`Total documents: ${count}`);

                if (count > 0) {
                    const sample = await collectionData.findOne();
                    console.log("Sample document structure:");
                    console.log(JSON.stringify(sample, null, 2).substring(0, 500) + "...");
                }
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

findFYPCollections();
