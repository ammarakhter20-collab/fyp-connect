const mongoose = require('mongoose');
const fs = require('fs');
// Register all required models
const FypRegistration = require('./server/models/StudentModels/fypRegModel');
const GenUser = require('./server/models/AdminModels/GenUserModel');
const Panel = require('./server/models/CoordinatorModels/PenalModel');
require('dotenv').config();

const testQuery = async () => {
    let output = [];
    const log = (msg) => { console.log(msg); output.push(msg); };

    try {
        await mongoose.connect(process.env.MONGO_URL);
        log("=== TESTING EXACT BACKEND QUERY ===\n");

        const userId = "69751190f01fb5bf751baa1c";
        log("Testing for user ID: " + userId);

        // Replicate the exact query from FetchAssignedExams.js
        const fypRegistrations = await FypRegistration.find()
            .populate({
                path: "assignedPanel",
                populate: {
                    path: "PanelMembers.member",
                    model: "GenUser",
                },
            })
            .populate("selectedOption");

        log(`Total FYP registrations: ${fypRegistrations.length}`);

        // Step 2: Filter for panels where user is a member
        const panelIds = fypRegistrations
            .filter((fyp) => {
                const hasPanel = fyp.assignedPanel && fyp.assignedPanel.PanelMembers;
                if (!hasPanel) {
                    return false;
                }

                const isMember = fyp.assignedPanel.PanelMembers.some((member) => {
                    const mId = member.member && member.member._id
                        ? member.member._id.toString()
                        : (member.member ? member.member.toString() : null);
                    return mId === userId;
                });

                if (isMember) {
                    log(`  Found: FYP ${fyp._id} - User IS a member of panel ${fyp.assignedPanel.panelCode || fyp.assignedPanel._id}`);
                }
                return isMember;
            })
            .map((fyp) => fyp.assignedPanel._id);

        log(`\nPanel IDs matching user: ${panelIds.length}`);

        // Step 3: Separate into supervisor and examiner
        const asSupervisor = [];
        const asExaminer = [];

        fypRegistrations.forEach((fyp) => {
            if (
                fyp.assignedPanel &&
                panelIds.some((id) => id.toString() === fyp.assignedPanel._id.toString())
            ) {
                if (fyp.selectedOption && fyp.selectedOption._id.toString() === userId) {
                    asSupervisor.push(fyp);
                } else {
                    asExaminer.push(fyp);
                }
            }
        });

        log(`\n=== RESULT ===`);
        log(`As Supervisor: ${asSupervisor.length}`);
        log(`As Examiner: ${asExaminer.length}`);

        if (asExaminer.length > 0) {
            log("\nExaminer exams:");
            asExaminer.forEach(e => {
                log(`  - ${e.topicData?.topic || e._id}`);
            });
        }

    } catch (err) {
        log("ERROR: " + err.message);
        console.error(err);
    } finally {
        fs.writeFileSync('test_output.txt', output.join('\n'));
        await mongoose.disconnect();
    }
};

testQuery();
