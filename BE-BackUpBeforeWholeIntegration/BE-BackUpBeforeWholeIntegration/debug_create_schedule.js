
const mongoose = require('mongoose');
const CreateExamSchedule = require('./server/models/CoordinatorModels/ExamScheduleModel');
const CreateExam = require('./server/models/CoordinatorModels/ExamCreationModel');
const Panel = require('./server/models/CoordinatorModels/PenalModel');
const moment = require('moment');

const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected...");
        try {
            const panel = await Panel.findOne();
            const exam = await CreateExam.findOne();

            if (!panel || !exam) {
                console.log("Missing panel or exam for test.");
                return;
            }

            console.log(`Testing with Panel: ${panel._id} and Exam: ${exam._id}`);

            const rawTime = "14:30";
            const formattedTime = moment(rawTime, "HH:mm").format("hh:mm A");
            console.log(`Formatted Time: ${formattedTime}`);

            const payload = {
                panel: panel._id,
                ExamDate: new Date(),
                ExamTime: formattedTime,
                Venue: "Debug Room",
                CreatedExam: exam._id
            };

            const newSchedule = new CreateExamSchedule(payload);
            await newSchedule.save();

            console.log("Successfully created schedule!");
            console.log(newSchedule);

            // cleanup
            await CreateExamSchedule.deleteOne({ _id: newSchedule._id });
            console.log("Cleaned up.");

        } catch (err) {
            console.error("Creation Error:", err.message);
            if (err.errors) {
                Object.keys(err.errors).forEach(key => {
                    console.error(`- ${key}: ${err.errors[key].message}`);
                });
            }
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
