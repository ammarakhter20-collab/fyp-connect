const ExamMarks = require("../../models/SupervisorModels/examMarksAssignment");

const updateExamMarks = async (req, res) => {
  const { examId, examinerId, groupId, marks, feedback, partStatus } = req.body;

  // console.log(req.body.marks);

  try {
    // Search for an existing document based on examId and groupId
    let examMarks = await ExamMarks.findOne({ exam: examId, groupId });

    // If document is not found, create a new instance
    if (!examMarks) {
      const marksArray = Object.values(marks); // Convert marks object into an array of values
      examMarks = new ExamMarks({
        exam: examId,
        groupId,
        examiners: [
          {
            examiner: examinerId,
            marks: marksArray.map(
              ({ id: studentId, marks: obtainedMarks }) => ({
                student: studentId,
                obtainedMarks,
              })
            ),

            feedback,
          },
        ],
        partStatus,
      });
    } else {
      // Update the examiners array for the specified examiner
      const examinerIndex = examMarks.examiners.findIndex(
        (e) => e.examiner === examinerId
      );
      if (examinerIndex === -1) {
        examMarks.examiners.push({
          examiner: examinerId,
          marks: [
            {
              student: marks.studentId,
              obtainedMarks: marks.obtainedMarks,
              totalMarks: marks.totalMarks,
            },
          ],
          feedback,
        });
      } else {
        examMarks.examiners[examinerIndex].marks.push({
          student: marks.studentId,
          obtainedMarks: marks.obtainedMarks,
          totalMarks: marks.totalMarks,
          feedback,
        });
      }
    }

    await examMarks.save();
    res
      .status(200)
      .json({ message: "Exam marks updated successfully", examMarks });
  } catch (error) {
    console.error("Error updating exam marks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMarksByPartStatusAndGroupId = async (req, res) => {
  try {
    const { groupId: groupId } = req.query;
    console.log(groupId, "of the Group ");
    const examMarks = await ExamMarks.find({ groupId: groupId });
    res.status(200).json({ examMarks });
  } catch (error) {
    console.error("Error getting exam marks:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updateExamMarks, getMarksByPartStatusAndGroupId };
