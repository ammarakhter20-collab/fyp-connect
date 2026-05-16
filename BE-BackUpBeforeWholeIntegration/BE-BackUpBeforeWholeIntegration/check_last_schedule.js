
const mongoose = require('mongoose');
const CreateExamSchedule = require('./server/models/CoordinatorModels/ExamScheduleModel');
const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');

const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            // Get the most recently created schedule
            const lastSchedule = await CreateExamSchedule.findOne().sort({ _id: -1 });

            if (!lastSchedule) {
                console.log(JSON.stringify({ found: false, message: "No schedules found" }));
                return;
            }

            const examId = lastSchedule.CreatedExam;
            const exam = await CreateExam.findById(examId);

            const result = {
                found: true,
                schedule: {
                    _id: lastSchedule._id,
                    panel: lastSchedule.panel,
                    examDate: lastSchedule.ExamDate,
                    examTime: lastSchedule.ExamTime,
                    createdExamIdInSchedule: lastSchedule.CreatedExam
                },
                examMatch: {
                    found: !!exam,
                    examId: exam ? exam._id : null,
                    examName: exam && exam.ExamType ? "Populate needed for name" : "N/A",
                    term: exam ? exam.Term : "N/A"
                },
                idsMatch: exam ? (lastSchedule.CreatedExam.toString() === exam._id.toString()) : false
            };

            console.log(JSON.stringify(result, null, 2));

        } catch (err) {
            console.error(JSON.stringify({ error: err.message }));
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(JSON.stringify({ error: err.message })));
