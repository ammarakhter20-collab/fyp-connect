const mongoose = require('mongoose');
require('dotenv').config();

async function findSupervisorsWithTopics() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        // Check the topics collection
        const topicsCollection = mongoose.connection.collection('topics');
        const topics = await topicsCollection.find({}).limit(10).toArray();

        console.log(`=== Found ${topics.length} Topics ===\n`);

        if (topics.length === 0) {
            console.log("No topics found in database.\n");
        } else {
            const genUsersCollection = mongoose.connection.collection('genusers');

            for (let i = 0; i < Math.min(topics.length, 5); i++) {
                const topic = topics[i];
                console.log(`--- Topic ${i + 1} ---`);
                console.log(`Topic: ${topic.topic || 'N/A'}`);
                console.log(`Description: ${(topic.description || 'N/A').substring(0, 100)}...`);
                console.log(`Supervisor ID: ${topic.supervisorId || topic.supervisor || 'N/A'}`);

                const supervisorId = topic.supervisorId || topic.supervisor;
                if (supervisorId) {
                    const supervisor = await genUsersCollection.findOne({
                        _id: new mongoose.Types.ObjectId(supervisorId)
                    });

                    if (supervisor) {
                        console.log('\n** SUPERVISOR **');
                        console.log(`Name: ${supervisor.name}`);
                        console.log(`Email: ${supervisor.email}`);
                        console.log(`Faculty ID: ${supervisor.facultyId || 'N/A'}`);
                    }
                }
                console.log('\n' + '='.repeat(50) + '\n');
            }

            // Also show total per supervisor
            const supervisorCounts = {};
            topics.forEach(t => {
                const supId = (t.supervisorId || t.supervisor || '').toString();
                if (supId) {
                    supervisorCounts[supId] = (supervisorCounts[supId] || 0) + 1;
                }
            });

            console.log("=== Topics per Supervisor ===");
            for (const [supId, count] of Object.entries(supervisorCounts)) {
                const sup = await genUsersCollection.findOne({
                    _id: new mongoose.Types.ObjectId(supId)
                });
                if (sup) {
                    console.log(`${sup.name} (${sup.email}): ${count} topics`);
                }
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
        await mongoose.disconnect();
    }
}

findSupervisorsWithTopics();
