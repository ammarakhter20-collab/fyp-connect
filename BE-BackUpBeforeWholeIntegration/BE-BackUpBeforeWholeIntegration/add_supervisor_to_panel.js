const mongoose = require('mongoose');
const GenUser = require('./server/models/AdminModels/GenUserModel');
const Panel = require('./server/models/CoordinatorModels/PenalModel');
const FYPReg = require('./server/models/StudentModels/fypRegModel');
require('dotenv').config();

const addSupervisorToPanel = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        // 1. Find the "supervisor" user by name
        const supervisor = await GenUser.findOne({ name: /^supervisor$/i });
        if (!supervisor) {
            console.log("User 'supervisor' not found. Listing all faculty users:");
            const allFaculty = await GenUser.find({ role: 'faculty' }).select('name _id');
            allFaculty.forEach(f => console.log(`  - ${f.name} (ID: ${f._id})`));
            return;
        }
        console.log(`Found supervisor: ${supervisor.name} (ID: ${supervisor._id})`);

        // 2. Find an FYP registration that has a linked panel
        const fypWithPanel = await FYPReg.findOne({ assignedPanel: { $ne: null } })
            .populate('assignedPanel');

        if (!fypWithPanel) {
            console.log("No FYP registration with an assigned panel found!");
            return;
        }

        console.log(`Found FYP with panel: ${fypWithPanel._id}`);
        console.log(`  Panel: ${fypWithPanel.assignedPanel.panelName} (ID: ${fypWithPanel.assignedPanel._id})`);

        // 3. Check if supervisor is already in this panel
        const panel = await Panel.findById(fypWithPanel.assignedPanel._id);
        const alreadyMember = panel.PanelMembers.some(
            pm => pm.member.toString() === supervisor._id.toString()
        );

        if (alreadyMember) {
            console.log("Supervisor is ALREADY a member of this panel!");
            return;
        }

        // 4. Add supervisor to the panel
        panel.PanelMembers.push({
            member: supervisor._id,
            role: "Examiner"
        });
        await panel.save();
        console.log(`SUCCESS: Added '${supervisor.name}' to panel '${panel.panelName}' as Examiner.`);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

addSupervisorToPanel();
