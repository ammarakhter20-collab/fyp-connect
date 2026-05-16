const mongoose = require('mongoose');
require('dotenv').config();

const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

async function sync() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const correctId = "697b64c756273c082e9eba85"; // 121
        const wrongId = "697b6a4856273c082e9eba85"; // eba85 but wrong mid

        const evals = await Evaluation.find({});
        console.log(`Checking ${evals.length} documents...`);

        for (const doc of evals) {
            let changed = false;
            doc.terms.forEach(t => {
                console.log(`  Matching term: ${t.termId.toString()} vs ${wrongId}`);
                if (t.termId.toString() === wrongId) {
                    console.log(`  Fixing term ID from ${t.termId} to ${correctId}`);
                    t.termId = new mongoose.Types.ObjectId(correctId);
                    changed = true;
                }
            });

            if (changed) {
                doc.markModified('terms');
                await doc.save();
                console.log(`  Saved doc ${doc._id}`);
            }
        }

        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}

sync();
