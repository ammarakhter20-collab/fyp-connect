
const mongoose = require('mongoose');
const CreatedExamModel = require('./server/models/CoordinatorModels/ExamCreationModel');

// const mongoURI = "mongodb://0.0.0.0:27017/FYP";
const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            console.log("--- Fetching one CreatedExam ---");
            const exam = await CreatedExamModel.findOne();
            if (exam) {
                console.log("Exam ID:", exam._id);
                console.log("Term Value:", exam.Term);
                console.log("Term Type:", typeof exam.Term);
            } else {
                console.log("No CreatedExam found.");
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
