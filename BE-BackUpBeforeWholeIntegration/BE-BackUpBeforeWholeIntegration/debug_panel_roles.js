const mongoose = require('mongoose');
const Panel = require('./server/models/CoordinatorModels/PenalModel');
const GenUser = require('./server/models/AdminModels/GenUserModel');
require('dotenv').config();

const debugPanelRoles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        // Find panel "002"
        const panels = await Panel.find({}).populate('PanelMembers.member', 'name');

        console.log("=== ALL PANELS ===");
        panels.forEach(p => {
            console.log(`\nPanel: ${p.panelName || p.panelCode} (ID: ${p._id})`);
            p.PanelMembers.forEach((pm, i) => {
                const memberName = pm.member?.name || 'UNKNOWN';
                console.log(`  ${i + 1}. ${memberName} - Role: "${pm.role}"`);
            });
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

debugPanelRoles();
