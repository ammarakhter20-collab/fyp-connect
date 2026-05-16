
const mongoose = require('mongoose');
const CreatedExamModel = require('./server/models/CoordinatorModels/ExamCreationModel');
const FypRegistration = require('./server/models/StudentModels/fypRegModel');

// const mongoURI = "mongodb://0.0.0.0:27017/FYP";
const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            console.log("--- Patching Exam Term ---");

            // 1. Find a valid Term ID from an existing group
            const group = await FypRegistration.findOne({ term: { $exists: true } });
            if (!group) {
                console.log("No group with Term found. Cannot infer Term.");
                return;
            }

            // Extract ID whether it's object or string
            let termId = group.term._id || group.term;
            if (typeof termId === 'object') termId = termId.toString(); // Force string for safe use

            console.log(`Inferred Term ID from Group: ${termId}`);

            // 2. Find the Exam that is missing Term
            // We'll just take the first one that exists
            const exam = await CreatedExamModel.findOne();
            if (!exam) {
                console.log("No exam found to patch.");
                return;
            }

            console.log(`Exam BEFORE Patch: Term = ${exam.Term}`);

            // 3. Patch It
            // We use updateOne to bypass strict schema validation if needed, or just save.
            // But better to use ObjectId
            exam.Term = mongoose.Types.ObjectId(termId);
            await exam.save();

            console.log(`Exam AFTER Patch: Term = ${exam.Term}`);

            console.log("✅ Patch Complete. Now user's retry should work.");

        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
