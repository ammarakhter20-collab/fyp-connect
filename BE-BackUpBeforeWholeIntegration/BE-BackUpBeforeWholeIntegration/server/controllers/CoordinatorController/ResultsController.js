const Result = require('../../models/CoordinatorModels/ResultsModel'); // Adjust the path accordingly
const GenUser = require('../../models/AdminModels/GenUserModel'); // Adjust the path accordingly
const Evaluation = require('../../models/CoordinatorModels/EvaluateExamModel'); // Assuming you have an Evaluation model

// Function to get part status of student from GenUser schema
const getPartStatus = async (studentId) => {
  try {
    const student = await GenUser.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    return student.partStatus; // Assuming partStatus is a field in GenUser schema
  } catch (error) {
    throw new Error('Error fetching part status');
  }
};


// Define the arrays for part 1 and part 2 exams
const part_1_exams = ["Orientation", "Proposal", "Mid-I", "Attendance-I", "Final-I"];
const part_2_exams = ["Mid-II", "Attendance-II", "Final-II"];

// Controller function to store marks and results of students
const storeStudentResults = async (req, res) => {
  const { termId } = req.body;

  try {
    // Fetch the evaluations for the specified term
    const evaluations = await Evaluation.find({ termId });

    // Check if all required exams for both parts exist
    const examNames = evaluations.map(evaluation => evaluation.examName);
    const part1Exists = part_1_exams.every(exam => examNames.includes(exam));
    const part2Exists = part_2_exams.every(exam => examNames.includes(exam));

    if (!part1Exists || !part2Exists) {
      return res.status(400).json({ message: 'Required exams for both parts do not exist' });
    }

    // Fetch or create the term in the Result schema
    let result = await Result.findOne({ 'terms.termId': termId });
    if (!result) {
      result = new Result({ terms: [{ termId, students: [] }] });
    } else {
      result = result.terms.find(t => t.termId.equals(termId));
    }

    const studentsResults = [];

    // Process each evaluation
    for (const evaluation of evaluations) {
      for (const group of evaluation.fypGroups) {
        for (const student of group.students) {
          const studentId = student.studentId;
          const obtainedAverage = student.obtainedAverage || 0;

          let studentResult = studentsResults.find(s => s.studentId.toString() === studentId.toString());
          if (!studentResult) {
            studentResult = {
              studentId,
              part_1: [],
              part_2: []
            };
            studentsResults.push(studentResult);
          }

          const partEntry = {
            examId: evaluation.examId,
            marks: obtainedAverage,
            resultStatus: 'F'
          };

          if (part_1_exams.includes(evaluation.examName)) {
            studentResult.part_1.push(partEntry);
          } else if (part_2_exams.includes(evaluation.examName)) {
            studentResult.part_2.push(partEntry);
          }
        }
      }
    }

    // Calculate total marks and result status
    studentsResults.forEach(studentResult => {
      const totalPart1 = studentResult.part_1.reduce((acc, part) => acc + (part.marks || 0), 0);
      const totalPart2 = studentResult.part_2.reduce((acc, part) => acc + (part.marks || 0), 0);

      studentResult.part_1.forEach(part => {
        part.resultStatus = totalPart1 >= 50 ? 'P' : 'F';
      });
      studentResult.part_2.forEach(part => {
        part.resultStatus = totalPart2 >= 50 ? 'P' : 'F';
      });
    });

    // Save or update the results in the Result schema
    if (result) {
      const termIndex = result.terms.findIndex(t => t.termId.toString() === termId.toString());
      if (termIndex !== -1) {
        result.terms[termIndex].students = studentsResults;
      } else {
        result.terms.push({ termId, students: studentsResults });
      }
    } else {
      result = new Result({ terms: [{ termId, students: studentsResults }] });
    }

    await result.save();

    res.status(200).json({ message: 'Results stored successfully' });
  } catch (error) {
    console.error('Error storing results:', error);
    res.status(500).json({ message: 'Error storing results' });
  }
};


// Function to get results by Group ID and User ID (Supervisor/Panel?)
const getResultsByGroupId = async (req, res) => {
  const { groupId, userId } = req.params;
  console.log(`getResultsByGroupId called for Group: ${groupId}, User: ${userId}`);

  try {
    // 1. Find the FYP Group to get student IDs
    const FypRegistration = require('../../models/StudentModels/fypRegModel'); // Need to import this inside or top
    const group = await FypRegistration.findById(groupId).populate('groupMembers');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const studentIds = group.groupMembers.map(m => m._id.toString());
    const termId = group.term; // Assuming term is populated or just ID

    if (!termId) {
      return res.status(404).json({ message: 'Term ID not found in group' });
    }

    // 2. Fetch Results for this term
    const resultDoc = await Result.findOne({ 'terms.termId': termId });

    if (!resultDoc) {
      return res.status(404).json({ message: 'No results found for this term' });
      // Or return empty structure if preferred
    }

    const termResults = resultDoc.terms.find(t => t.termId.toString() === termId.toString());

    if (!termResults) {
      return res.status(404).json({ message: 'Term results not found' });
    }

    // 3. Filter for students in this group
    const groupResults = termResults.students.filter(s => studentIds.includes(s.studentId.toString()));

    // 4. Format the response as expected by frontend
    // Frontend expects: { result: [...] } or array?
    // Let's verify frontend expectation later, for now sending filtered results.

    res.status(200).json({ result: groupResults });

  } catch (error) {
    console.error('Error fetching group results:', error);
    res.status(500).json({ message: 'Error fetching group results' });
  }
};

module.exports = {
  storeStudentResults,
  getResultsByGroupId
};
