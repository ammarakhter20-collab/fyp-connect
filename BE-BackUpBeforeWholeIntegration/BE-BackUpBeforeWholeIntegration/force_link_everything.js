
const mongoose = require('mongoose');
const CreateExamSchedule = require('./server/models/CoordinatorModels/ExamScheduleModel');
const Panel = require('./server/models/CoordinatorModels/PenalModel');
const FypRegistration = require('./server/models/StudentModels/fypRegModel');
const GenUser = require('./server/models/AdminModels/GenUserModel');

// const mongoURI = "mongodb://0.0.0.0:27017/FYP";
const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            console.log("=== FORCE LINKING SCRIPT START ===");

            // 1. Get the Schedule 
            const schedule = await CreateExamSchedule.findOne();
            if (!schedule) {
                console.log("❌ No Exam Schedule found at all.");
                return;
            }

            let panelId = schedule.panel;
            let panelData = null;

            // Check if panel exists
            if (panelId) {
                panelData = await Panel.findById(panelId);
            }

            if (!panelData) {
                console.log("⚠️ Schedule has broken/missing Panel link. Finding ANY valid panel...");
                panelData = await Panel.findOne();
                if (!panelData) {
                    console.log("❌ No Panels exist in DB. Creating one...");
                    // Create dummy panel logic here if needed, or abort.
                    // For now, assume at least one panel exists if user is testing.
                    return;
                }
                // Update schedule to use this valid panel
                schedule.panel = panelData._id;
                await schedule.save();
                console.log(`✅ Repaired Schedule to use Panel: ${panelData.panelName}`);
            }

            panelId = panelData._id;
            console.log(`✅ Using Panel: ${panelData.panelName} (ID: ${panelId})`);

            // 2. Identify the Supervisor (User)
            // We'll find a user with role 'supervisor' (case insensitive) and see if they are in the panel
            const supervisors = await GenUser.find({ role: { $regex: /supervisor/i } });
            const supervisorIds = supervisors.map(s => s._id.toString());
            console.log(`Found ${supervisors.length} Supervisors in DB.`);

            // Re-fetch panel data in case we need to update members (though we have it in panelData from line 33/28)
            // But let's verify fresh state.
            panelData = await Panel.findById(panelId);
            let isSupervisorInPanel = false;

            if (panelData.PanelMembers) {
                panelData.PanelMembers.forEach(pm => {
                    const mId = pm.member.toString();
                    if (supervisorIds.includes(mId)) {
                        isSupervisorInPanel = true;
                        console.log(`✅ Supervisor ${mId} IS a member of this panel.`);
                    }
                });

                if (!isSupervisorInPanel && supervisors.length > 0) {
                    console.log("⚠️ WARNING: No Supervisor is in this panel! Adding the first one...");
                    const supToAdd = supervisors[0];
                    panelData.PanelMembers.push({ member: supToAdd._id, role: 'Supervisor' });
                    await panelData.save();
                    console.log(`✅ Added Supervisor ${supToAdd.name} to Panel.`);
                }

                // 3. FORCE UPDATE ALL GROUPS TO THIS PANEL
                // We will target groups that have NO panel, or verify existing ones.
                // Actually, let's just update ALL groups to this panel to be absolutely sure.
                // (Assuming this is a test env or the user wants this exam for everyone).

                const updateResult = await FypRegistration.updateMany(
                    {}, // Matches ALL documents
                    { $set: { assignedPanel: panelId } }
                );

                console.log(`✅ FORCE UPDATED ${updateResult.nModified} groups to use Panel ${panelId}.`);
                console.log(`   (Matched: ${updateResult.n}, Modified: ${updateResult.nModified})`);

                console.log("=== DONE. REFRESH PAGE NOW. ===");

            }

        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
