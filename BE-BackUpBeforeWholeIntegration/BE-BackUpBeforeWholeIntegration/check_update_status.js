
const mongoose = require('mongoose');
const Project = require('./server/models/StudentModels/fypRegModel');
const CreateExamSchedule = require('./server/models/CoordinatorModels/ExamScheduleModel');

// const mongoURI = "mongodb://0.0.0.0:27017/FYP";
const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            console.log("--- Checking Exam Schedule Panel vs Group Panels ---");

            // 1. Get the Exam Schedule (assuming only 1 for simplicity, or grab first)
            const schedule = await CreateExamSchedule.findOne().populate('panel');
            if (!schedule) {
                console.log("No Exam Schedule found!");
                return;
            }

            console.log(`Schedule Found: ID ${schedule._id}`);
            console.log(`- Scheduled Panel: ${schedule.panel?._id} (${schedule.panel?.panelName})`);
            console.log(`- Exam Term: ${schedule.CreatedExam?.Term || JSON.stringify(schedule.CreatedExam)}`); // CreatedExam might not be populated deep enough here if I didn't populate it.
            // Wait, schema has CreatedExam ref. I should populate it to see the Term.

            // Re-fetch with deep population if needed, but let's check groups first.

            const targetPanelId = schedule.panel?._id.toString();

            // 2. Count Groups with THIS panel
            const groupsWithPanel = await Project.countDocuments({ assignedPanel: targetPanelId });
            console.log(`Groups with THIS Panel (${targetPanelId}): ${groupsWithPanel}`);

            // 3. Count Groups matching term (we need the exam term ID to check this)
            // Let's dump the raw terms from groups without panels to see what they look like.
            const groupsMissingPanel = await Project.find({ assignedPanel: { $exists: false } }).limit(5);
            if (groupsMissingPanel.length > 0) {
                console.log("\nSample Groups MISSING Panel:");
                groupsMissingPanel.forEach(g => {
                    console.log(`- Group ID: ${g._id}, Term: ${g.term} (Type: ${typeof g.term})`);
                });
            } else {
                console.log("No groups found satisfying { assignedPanel: { $exists: false } } (Checking null next)");
                const groupsNullPanel = await Project.find({ assignedPanel: null }).limit(5);
                if (groupsNullPanel.length > 0) {
                    console.log("\nSample Groups with NULL Panel:");
                    groupsNullPanel.forEach(g => {
                        console.log(`- Group ID: ${g._id}, Term: ${g.term} (Type: ${typeof g.term})`);
                    });
                }
            }

            const totalGroups = await Project.countDocuments({});
            console.log(`\nTotal Groups in DB: ${totalGroups}`);

        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
