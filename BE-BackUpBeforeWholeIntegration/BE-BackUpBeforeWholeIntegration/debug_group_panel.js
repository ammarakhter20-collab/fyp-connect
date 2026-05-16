const mongoose = require('mongoose');
const Panel = require('./server/models/CoordinatorModels/PenalModel');
const FYPReg = require('./server/models/StudentModels/fypRegModel');
const GenUser = require('./server/models/AdminModels/GenUserModel');
require('dotenv').config();

const debugGroupPanel = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        // Fetch all groups with an assigned panel
        const groups = await FYPReg.find({ assignedPanel: { $ne: null } })
            .populate('topicData')
            .populate({
                path: 'assignedPanel',
                populate: {
                    path: 'PanelMembers.member',
                    model: 'GenUser',
                    select: 'name role'
                }
            });

        console.log(`\nFound ${groups.length} groups with assigned panels.`);

        groups.forEach(g => {
            console.log(`\nGroup: ${g.topicData?.topic || g._id}`);
            const panel = g.assignedPanel;
            if (!panel) {
                console.log("  Panel: NULL (Odd, query excludes null)");
                return;
            }
            console.log(`  Assigned Panel: ${panel.panelName} (ID: ${panel._id})`);
            console.log(`  Members: ${panel.PanelMembers.length}`);
            panel.PanelMembers.forEach((pm, i) => {
                const m = pm.member;
                if (m) console.log(`    ${i + 1}. ${m.name} (${pm.role}) - ID: ${m._id}`);
                else console.log(`    ${i + 1}. INVALID ID: ${pm.member}`);
            });
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

debugGroupPanel();
