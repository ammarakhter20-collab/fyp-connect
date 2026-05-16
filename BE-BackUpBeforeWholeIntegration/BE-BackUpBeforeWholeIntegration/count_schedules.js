
const mongoose = require('mongoose');
const CreateExamSchedule = require('./server/models/CoordinatorModels/ExamScheduleModel');

// const mongoURI = "mongodb://0.0.0.0:27017/FYP";
const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            const count = await CreateExamSchedule.countDocuments();
            console.log(`Schedule Count: ${count}`);
        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
