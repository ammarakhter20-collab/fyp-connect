const mongoose = require('mongoose');
const GenUser = require('./server/models/AdminModels/GenUserModel');
const Panel = require('./server/models/CoordinatorModels/PenalModel');
const FYPReg = require('./server/models/StudentModels/fypRegModel');
require('dotenv').config();

const debugSupervisorQuery = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        // 1. Find users with supervisor-like names
        const users = await GenUser.find({
            $or: [
                { name: /supervisor/i },
                { name: /faculty/i }
            ]
        }).select('name role _id');

        console.log("=== USERS FOUND ===");
        users.forEach(u => console.log(`${u.name} | Role: ${u.role} | ID: ${u._id}`));

        // 2. For each user, check their panel membership and FYP assignments
        for (const user of users) {
            console.log(`\n=== DATA FOR: ${user.name} ===`);

            // Check panels
            const panels = await Panel.find({ 'PanelMembers.member': user._id });
            console.log(`Panels: ${panels.length}`);

            // Check as Supervisor
            const asSup = await FYPReg.find({ selectedOption: user._id }).select('topicData._id');
            console.log(`As Supervisor (selectedOption matches): ${asSup.length}`);

            // Check as Examiner (via panel)
            const asExam = await FYPReg.find({
                assignedPanel: { $in: panels.map(p => p._id) }
            });
            console.log(`As Examiner (assignedPanel matches their panels): ${asExam.length}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

debugSupervisorQuery();
