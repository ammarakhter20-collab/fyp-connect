
const mongoose = require('mongoose');
const FypRegistration = require('./server/models/StudentModels/fypRegModel');
const PanelDetails = require('./server/models/CoordinatorModels/PenalModel');
// const GenUser = require('./server/models/AdminModels/GenUserModel');

// const mongoURI = "mongodb://0.0.0.0:27017/FYP";
const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            // We need a user ID to test with. I'll search for a Faculty user first.
            // Or if I knew the user ID from previous steps... 
            // Let's list all faculty/supervisors and their panels 

            // Hardcode a user ID if known, or find one.
            // Let's find "Mm Alam" or similar from previous context if possible, or just list all.

            console.log("--- Fetching all FYP Registrations with populated Panels ---");

            const fypRegistrations = await FypRegistration.find()
                .populate({
                    path: 'assignedPanel',
                    populate: {
                        path: 'PanelMembers.member',
                        model: 'GenUser'
                    }
                })
                .populate('selectedOption') // Supervisor
                .populate('term');

            console.log(`Found ${fypRegistrations.length} FYP Groups.`);

            fypRegistrations.forEach(group => {
                console.log(`\nGroup: ${group.topicData?.topic || "Unknown Topic"} (ID: ${group._id})`);
                console.log(`- Supervisor: ${group.selectedOption?.name} (ID: ${group.selectedOption?._id})`);

                if (!group.assignedPanel) {
                    console.log(`- Panel: NOT ASSIGNED`);
                } else {
                    console.log(`- Panel: ${group.assignedPanel.panelName} (ID: ${group.assignedPanel._id})`);
                    console.log(`- Panel Members:`);
                    if (group.assignedPanel.PanelMembers && group.assignedPanel.PanelMembers.length > 0) {
                        group.assignedPanel.PanelMembers.forEach(m => {
                            const name = m.member?.name || "Unknown";
                            const id = m.member?._id || m.member || "Unknown";
                            const role = m.role || "Unknown Role";
                            console.log(`  * ${name} (${role}) [ID: ${id}]`);
                        });
                    } else {
                        console.log("  * No members in panel object?");
                    }
                }
            });

        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
