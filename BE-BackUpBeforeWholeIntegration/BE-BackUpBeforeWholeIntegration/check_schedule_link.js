
const mongoose = require('mongoose');
const CreateExamSchedule = require('./server/models/CoordinatorModels/ExamScheduleModel');
const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');

const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to MongoDB for diagnostics...");

        try {
            const exams = await CreateExam.find({}, '_id Term ExamType');
            const schedules = await CreateExamSchedule.find({});

            const summary = {
                totalExams: exams.length,
                totalSchedules: schedules.length,
                matches: schedules.map(s => {
                    const match = exams.find(e => e._id.toString() === s.CreatedExam.toString());
                    return {
                        scheduleId: s._id,
                        examId: s.CreatedExam,
                        hasMatch: !!match,
                        matchExamType: match ? match.ExamType : 'N/A'
                    };
                })
            };
            console.log(JSON.stringify(summary, null, 2));

        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
