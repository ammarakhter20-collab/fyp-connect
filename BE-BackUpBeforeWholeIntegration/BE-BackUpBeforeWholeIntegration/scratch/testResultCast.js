const mongoose = require("mongoose");
const Result = require("../server/models/CoordinatorModels/ResultsModel");

const run = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("Connected to MongoDB successfully.");

    const examId = new mongoose.Types.ObjectId();
    const termId = new mongoose.Types.ObjectId();

    const dummyResult = new Result({
      terms: [
        {
          termId: termId,
          students: [
            {
              studentId: new mongoose.Types.ObjectId(),
              part_1: [
                {
                  examId: examId,
                  marks: 85,
                  resultStatus: "P"
                }
              ]
            }
          ]
        }
      ]
    });

    console.log("Raw object before save:", JSON.stringify(dummyResult, null, 2));

  } catch (err) {
    console.error("Error in script:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
