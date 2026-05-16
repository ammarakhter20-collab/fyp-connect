
const mongoose = require('mongoose');
const FypRegistration = require('./server/models/StudentModels/fypRegModel');

// const mongoURI = "mongodb://0.0.0.0:27017/FYP";
const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            console.log("--- Searching for FYP Groups ---");

            // Fetch all groups to find the one related to "Proposal Defense" 
            // Note: "Proposal Defense" is likely an Exam Title, not the topic.
            // But the user said "231-1 Proposal Defense". "231-1" might be the group name or code.

            const groups = await FypRegistration.find()
                .populate('assignedPanel')
                .populate('term');

            console.log(`Checking ${groups.length} groups for anomalies...`);

            let missingCount = 0;
            let assignedCount = 0;
            const termsFound = new Set();

            groups.forEach(group => {
                const hasPanel = !!group.assignedPanel;
                if (hasPanel) assignedCount++;
                else missingCount++;

                if (group.term) termsFound.add(group.term._id.toString());

                if (!hasPanel && missingCount <= 5) {
                    // Print first 5 missing just for sample
                    console.log(`[SAMPLE MISSING] ID: ${group._id}, Term: ${group.term?._id} (${group.term?.sessionTerm})`);
                }
            });

            console.log("\n--- SUMMARY ---");
            console.log(`Total Groups: ${groups.length}`);
            console.log(`With Panel: ${assignedCount}`);
            console.log(`Missing Panel: ${missingCount}`);
            console.log(`Terms Found: ${Array.from(termsFound).join(', ')}`);

        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
