
const mongoose = require('mongoose');
const CreatedExamModel = require('./server/models/CoordinatorModels/ExamCreationModel');

// const mongoURI = "mongodb://0.0.0.0:27017/FYP";
const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            const termId = "69750270f01fb5bf751ba495";
            console.log(`--- Patching Exam with Term ID: ${termId} ---`);

            const exam = await CreatedExamModel.findOne();
            if (exam) {
                console.log("Exam Found.");
                // We use updateOne to force the field if schema is stubborn
                await CreatedExamModel.updateOne(
                    { _id: exam._id },
                    { $set: { Term: termId } }
                );
                console.log("✅ Patch Applied.");
            } else {
                console.log("❌ No exam found.");
            }

        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
