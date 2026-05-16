const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/fyp"; // Adjust if needed

const fypRegSchema = new mongoose.Schema({
    selectedOption: { type: mongoose.Schema.Types.ObjectId, ref: 'GenUser' },
    reqStatus: String,
    groupMembers: [{
        registrationNumber: String,
        name: String
    }],
    topicData: {
        topic: String
    }
});

const genUserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String
});

const FypRegistration = mongoose.model('FypRegistration', fypRegSchema);
const GenUser = mongoose.model('GenUser', genUserSchema);

async function checkData() {
    try {
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB');

        const registrations = await FypRegistration.find({})
            .populate('selectedOption', 'name email role');

        console.log(`Found ${registrations.length} TOTAL FYP registrations.`);

        if (registrations.length === 0) {
            console.log('No approved projects found.');
        } else {
            registrations.forEach((reg, index) => {
                console.log(`\nProject #${index + 1}:`);
                console.log(`  ID: ${reg._id}`);
                console.log(`  Topic: ${reg.topicData?.topic}`);
                if (reg.selectedOption) {
                    console.log(`  Supervisor: ${reg.selectedOption.name} (ID: ${reg.selectedOption._id})`);
                } else {
                    console.log(`  Supervisor: NULL (orphaned reference or missing)`);
                }
                console.log(`  Members: ${reg.groupMembers.map(m => m.name).join(', ')}`);
            });
        }

        // Also list all supervisors to help match IDs
        const supervisors = await GenUser.find({ role: 'faculty' });
        console.log(`\n--- Available Supervisors ---`);
        supervisors.forEach(sup => {
            console.log(`Name: ${sup.name}, ID: ${sup._id}, Email: ${sup.email}`);
        });


    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

checkData();
