
const mongoose = require('mongoose');
const Project = require('./server/models/StudentModels/fypRegModel');
const CreateExamSchedule = require('./server/models/CoordinatorModels/ExamScheduleModel');

// const mongoURI = "mongodb://0.0.0.0:27017/FYP";
const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            console.log("--- Checking Terms ---");

            const schedule = await CreateExamSchedule.findOne().populate('CreatedExam');
            if (!schedule) { console.log("No schedule."); return; }

            const examTerm = schedule.CreatedExam?.Term;
            console.log(`Exam is for Term: ${examTerm}`);

            const groups = await Project.find().limit(10);
            console.log(`Checking ${groups.length} groups...`);
            groups.forEach(g => {
                console.log(`Group ${g._id} - Term: ${g.term} (Match? ${g.term == examTerm})`);
            });

        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
