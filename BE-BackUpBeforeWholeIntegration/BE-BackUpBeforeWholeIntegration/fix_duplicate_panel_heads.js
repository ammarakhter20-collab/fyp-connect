const mongoose = require('mongoose');
const Panel = require('./server/models/CoordinatorModels/PenalModel');
const GenUser = require('./server/models/AdminModels/GenUserModel');
require('dotenv').config();

const fixDuplicatePanelHeads = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        // Find all panels
        const panels = await Panel.find({}).populate('PanelMembers.member', 'name');

        let fixedCount = 0;

        for (const panel of panels) {
            // Find all Panel Heads
            const panelHeads = panel.PanelMembers.filter(pm => pm.role === 'Panel Head');

            if (panelHeads.length > 1) {
                console.log(`\nPanel "${panel.panelName || panel.panelCode}" has ${panelHeads.length} Panel Heads:`);
                panelHeads.forEach(ph => console.log(`  - ${ph.member?.name || 'Unknown'}`));

                // Keep the FIRST one as Panel Head, demote the rest
                let isFirst = true;
                for (const pm of panel.PanelMembers) {
                    if (pm.role === 'Panel Head') {
                        if (isFirst) {
                            isFirst = false;
                            console.log(`  Keeping: ${pm.member?.name}`);
                        } else {
                            pm.role = 'Examiner';
                            console.log(`  Demoting: ${pm.member?.name} -> Examiner`);
                        }
                    }
                }

                await panel.save();
                fixedCount++;
                console.log(`  FIXED!`);
            }
        }

        if (fixedCount === 0) {
            console.log("No panels with duplicate Panel Heads found.");
        } else {
            console.log(`\nFixed ${fixedCount} panel(s).`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

fixDuplicatePanelHeads();
