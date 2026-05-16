const mongoose = require('mongoose');
const Panel = require('./server/models/CoordinatorModels/PenalModel');
const FYPReg = require('./server/models/StudentModels/fypRegModel');
const GenUser = require('./server/models/AdminModels/GenUserModel');
require('dotenv').config();

const debugPanelAccess = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        const panels = await Panel.find({}).populate({
            path: "PanelMembers.member",
            model: "GenUser"
        });

        const multiMemberPanels = panels.filter(p => p.PanelMembers.length > 1);
        console.log(`Found ${multiMemberPanels.length} panels with > 1 member.`);

        for (const panel of multiMemberPanels) {
            console.log(`\n--------------------------------------------------`);
            console.log(`Panel: ${panel.panelName} (ID: ${panel._id})`);
            console.log(`Members Count: ${panel.PanelMembers.length}`);

            panel.PanelMembers.forEach((pm, index) => {
                const member = pm.member;
                if (member && member._id) {
                    console.log(`  Member ${index + 1}: ${member.name} (ID: ${member._id}) - Role: ${pm.role}`);
                } else {
                    console.log(`  Member ${index + 1}: INVALID/MISSING (Value: ${pm.member})`);
                }
            });

            // Check linked FYP Groups
            const linkedGroups = await FYPReg.find({ assignedPanel: panel._id });
            console.log(`  Linked Groups: ${linkedGroups.length}`);
            linkedGroups.forEach(g => console.log(`    - ${g.topicData?.topic || 'No Topic'} (ID: ${g._id})`));
        }

        if (multiMemberPanels.length === 0) {
            console.log("No panels with multiple members found. This might be why the user can't test it properly or why they think it's broken (if they expected to be on one).");
            // Also print ALL panels just to be sure
            console.log("\nListing ALL panels to verify:");
            panels.forEach(p => console.log(` - ${p.panelName}: ${p.PanelMembers.length} members`));
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

debugPanelAccess();
