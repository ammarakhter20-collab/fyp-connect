
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
            console.log("=== DIAGNOSTIC START ===");

            // 1. Get the latest Exam Schedule
            const schedule = await CreateExamSchedule.findOne(); // No populate
            if (!schedule) {
                console.log("❌ No Exam Schedule found.");
                return;
            }

            const targetPanelId = schedule.panel; // Should be an ID if not populated
            console.log(`✅ Exam Schedule Found:
   - ID: ${schedule._id}
   - Panel ID: ${targetPanelId}`);

            // 2. Check the Panel Members (skipped population to avoid crash)
            console.log("   (Skipping full member list dump to prevent crash)");

            // 3. Find FYP Groups and check assignments
            console.log("\n🔍 Checking FYP Groups (Simplified):");
            const groups = await FypRegistration.find().select('assignedPanel selectedOption topicData');

            let groupsWithPanel = 0;
            let groupsWithoutPanel = 0;

            groups.forEach(group => {
                const groupPanelId = group.assignedPanel; // ID is stored directly usually
                const hasPanel = !!groupPanelId;

                // Check formatted string match if it exists
                const isMatch = hasPanel && (groupPanelId.toString() === targetPanelId.toString());

                if (!hasPanel) {
                    groupsWithoutPanel++;
                } else if (isMatch) {
                    groupsWithPanel++;
                }
            });

            console.log(`\nSummary:
   - Groups with Correct Panel (${targetPanelId}): ${groupsWithPanel}
   - Groups with No Panel: ${groupsWithoutPanel}`);

            if (groupsWithPanel === 0) {
                console.log("\n❌ CONCLUSION: No groups are linked to the schedule's panel. The auto-assignment logic failed or hasn't run.");
            } else {
                console.log("\n✅ CONCLUSION: Groups ARE linked. If user can't see valid data, check if their UserID matches one of the Panel Members listed above.");
            }

        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
