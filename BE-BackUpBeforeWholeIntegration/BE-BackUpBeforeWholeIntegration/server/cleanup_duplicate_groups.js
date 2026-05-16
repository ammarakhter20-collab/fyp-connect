/**
 * Cleanup script: Remove duplicate Part-I documents that were created
 * by the old promotion logic. When the old code promoted groups to Part II,
 * it created a NEW document with partStatus: 'part-II' while leaving the 
 * original 'part-I' document in place. This script identifies those orphaned
 * Part-I records (where a Part-II duplicate exists with the same supervisor,
 * topic, and term) and removes the old Part-I record.
 * 
 * Run with: node server/cleanup_duplicate_groups.js
 */
const mongoose = require('mongoose');
require('dotenv').config();

const FypRegistration = require('./models/StudentModels/fypRegModel');

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/fyp_management_system', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Find all Part-II groups
        const partIIGroups = await FypRegistration.find({ partStatus: 'part-II', reqStatus: 'approved' });
        console.log(`Found ${partIIGroups.length} Part-II groups`);

        let removedCount = 0;

        for (const partIIGroup of partIIGroups) {
            // Find the matching Part-I duplicate:
            // Same supervisor (selectedOption), same topic, same term
            const duplicatePartI = await FypRegistration.findOne({
                partStatus: 'part-I',
                reqStatus: 'approved',
                term: partIIGroup.term,
                selectedOption: partIIGroup.selectedOption,
                'topicData.topic': partIIGroup.topicData?.topic
            });

            if (duplicatePartI) {
                console.log(`\n--- DUPLICATE FOUND ---`);
                console.log(`  Topic: ${duplicatePartI.topicData?.topic}`);
                console.log(`  Term: ${duplicatePartI.term}`);
                console.log(`  Part-I ID (OLD - will be REMOVED): ${duplicatePartI._id}`);
                console.log(`  Part-II ID (KEPT): ${partIIGroup._id}`);
                
                // Remove the orphaned Part-I record
                await FypRegistration.findByIdAndDelete(duplicatePartI._id);
                removedCount++;
                console.log(`  ✓ Removed duplicate Part-I record`);
            }
        }

        console.log(`\n=== CLEANUP COMPLETE ===`);
        console.log(`Removed ${removedCount} duplicate Part-I records`);
        console.log(`${partIIGroups.length} Part-II groups remain intact`);

    } catch (error) {
        console.error('Cleanup error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
}

cleanup();
