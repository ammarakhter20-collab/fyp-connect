const mongoose = require('mongoose');
require('dotenv').config();

// Define schema minimally
const genUserSchema = new mongoose.Schema({}, { strict: false });
const GenUser = mongoose.model('GenUser', genUserSchema);

async function getSupervisorCredentials() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB\n");

        // Find all users with role 'faculty' (supervisors)
        const supervisors = await GenUser.find({ role: 'faculty' })
            .select('facultyId name email password role');

        console.log(`=== Found ${supervisors.length} Supervisor(s) ===\n`);

        if (supervisors.length === 0) {
            console.log("No supervisors found. Checking for any faculty-like roles...\n");

            // Try to find with different role variations
            const altSupervisors = await GenUser.find({
                $or: [
                    { role: 'Faculty' },
                    { role: 'supervisor' },
                    { role: 'Supervisor' }
                ]
            }).select('facultyId name email password role');

            if (altSupervisors.length > 0) {
                console.log(`Found ${altSupervisors.length} faculty with alternative roles:\n`);
                altSupervisors.forEach((sup, index) => {
                    console.log(`--- ${index + 1}. ${sup.name} ---`);
                    console.log(`Email: ${sup.email}`);
                    console.log(`Password: ${sup.password}`);
                    console.log(`Role: ${sup.role}`);
                    console.log('');
                });
            }
        } else {
            supervisors.forEach((sup, index) => {
                console.log(`--- ${index + 1}. ${sup.name} ---`);
                console.log(`Faculty ID: ${sup.facultyId || 'N/A'}`);
                console.log(`Email: ${sup.email}`);
                console.log(`Password: ${sup.password}`);
                console.log('');
            });
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err.message);
    }
}

getSupervisorCredentials();
