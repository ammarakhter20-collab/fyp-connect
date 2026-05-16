const mongoose = require('mongoose');
const Panel = require('./server/models/CoordinatorModels/PenalModel');
const GenUser = require('./server/models/AdminModels/GenUserModel');
require('dotenv').config();

const debugPanelSimple = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const panels = await Panel.find({}).populate({
            path: "PanelMembers.member",
            model: "GenUser",
            select: "name role"
        });

        const multi = panels.filter(p => p.PanelMembers.length > 1);
        console.log(`\nFound ${multi.length} multi-member panels.`);

        multi.forEach(p => {
            console.log(`\nPID: ${p._id}`);
            p.PanelMembers.forEach((pm, i) => {
                const mem = pm.member;
                if (mem && mem._id) {
                    console.log(`  M${i + 1}: Valid User (ID: ${mem._id}, Role: ${mem.role})`);
                } else {
                    console.log(`  M${i + 1}: INVALID/Unpopulated (Raw: ${pm.member})`);
                }
            });
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

debugPanelSimple();
