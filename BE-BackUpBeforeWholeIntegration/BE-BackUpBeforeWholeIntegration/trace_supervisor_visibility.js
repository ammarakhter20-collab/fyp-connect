const mongoose = require('mongoose');
const fs = require('fs');
const GenUser = require('./server/models/AdminModels/GenUserModel');
const Panel = require('./server/models/CoordinatorModels/PenalModel');
const FYPReg = require('./server/models/StudentModels/fypRegModel');
require('dotenv').config();

const traceUserExamVisibility = async () => {
    let output = [];
    const log = (msg) => { console.log(msg); output.push(msg); };

    try {
        await mongoose.connect(process.env.MONGO_URL);
        log("=== TRACING SUPERVISOR EXAM VISIBILITY ===\n");

        // Step 1: Find the "supervisor" user
        const supervisor = await GenUser.findOne({ name: /^supervisor$/i });
        if (!supervisor) {
            log("ERROR: User 'supervisor' not found!");
            return;
        }
        log(`Step 1: Found User`);
        log(`  Name: ${supervisor.name}`);
        log(`  ID: ${supervisor._id}`);
        log(`  Role: ${supervisor.role}`);

        // Step 2: Check ALL panels
        const allPanels = await Panel.find({}).populate('PanelMembers.member', 'name _id');
        log(`\nStep 2: Total panels: ${allPanels.length}`);

        const panelsWithUser = allPanels.filter(p =>
            p.PanelMembers.some(pm =>
                pm.member && pm.member._id.toString() === supervisor._id.toString()
            )
        );

        log(`User is in ${panelsWithUser.length} panel(s)`);
        panelsWithUser.forEach(p => {
            const role = p.PanelMembers.find(pm => pm.member?._id.toString() === supervisor._id.toString())?.role;
            log(`  - ${p.panelName || p.panelCode} (ID: ${p._id}) Role: ${role}`);
        });

        // Step 3: FYP registrations with these panels
        const panelIds = panelsWithUser.map(p => p._id);
        const fypWithPanels = await FYPReg.find({ assignedPanel: { $in: panelIds } })
            .populate('topicData')
            .populate('selectedOption', 'name _id');

        log(`\nStep 3: FYP Groups: ${fypWithPanels.length}`);
        fypWithPanels.forEach(fyp => {
            const isSup = fyp.selectedOption?._id.toString() === supervisor._id.toString();
            log(`  - ${fyp.topicData?.topic || fyp._id} (${isSup ? 'Supervisor' : 'Examiner'})`);
        });

        // Step 4: As selectedOption
        const asSup = await FYPReg.find({ selectedOption: supervisor._id });
        log(`\nStep 4: As Supervisor (selectedOption): ${asSup.length}`);

        log("\n=== RESULT ===");
        if (panelsWithUser.length === 0) {
            log("PROBLEM: User not in any panel");
        } else if (fypWithPanels.length === 0) {
            log("PROBLEM: Panels not linked to FYP groups");
        } else {
            log("OK: User should see exams. Refresh page.");
        }

    } catch (err) {
        log("ERROR: " + err.message);
    } finally {
        fs.writeFileSync('debug_output.txt', output.join('\n'));
        await mongoose.disconnect();
    }
};

traceUserExamVisibility();
