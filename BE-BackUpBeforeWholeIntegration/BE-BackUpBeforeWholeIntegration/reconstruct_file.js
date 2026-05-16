const fs = require('fs');

const filePath = 'd:\\FYP\\FYP PORTAL CODE\\BE-BackUpBeforeWholeIntegration\\BE-BackUpBeforeWholeIntegration\\server\\controllers\\CoordinatorController\\EvaluateExamCont.js';

const content = `const Evaluation = require("../../models/CoordinatorModels/EvaluateExamModel");
const CreateExam = require("../../models/CoordinatorModels/ExamCreationModel");
const Term = require("../../models/AdminModels/fypTerm");
const mongoose = require("mongoose");
const FypRegistration = require("../../models/AdminModels/FypRegistration");
const CLOForExam = require("../../models/CoordinatorModels/CLOForExams");
const Question = require("../../models/CoordinatorModels/ExamQuestionModel");
const PanelDetails = require("../../models/CoordinatorModels/PanelDetails");
const ExamType = require("../../models/CoordinatorModels/ExamTypeModel");

// Helper Functions
const getQuestionDetails = async (questionId) => {
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error("Question with ID " + questionId + " not found");
    }
    return question;
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};

const getExamTypeName = async (examTypeId) => {
  const examType = await ExamType.findById(examTypeId);
  return examType ? examType.examName : "";
};

const calculateAverageCLOPercentage = (student) => {
  const cloIds = new Set();
  student.evaluationsByExaminers?.forEach((examiner) => {
    examiner.evaluations?.forEach((cloForExam) => {
      cloForExam.cloEvaluations?.forEach((cloEvaluation) => {
        if (cloEvaluation.cloId) {
          cloIds.add(cloEvaluation.cloId.toString());
        }
      });
    });
  });

  const cloData = {};
  cloIds.forEach((cloId) => {
    cloData[cloId] = { sum: 0, count: 0 };
  });

  student.evaluationsByExaminers?.forEach((examiner) => {
    examiner.evaluations?.forEach((evaluation) => {
      evaluation.cloEvaluations?.forEach((cloEvaluation) => {
        if (!cloEvaluation.cloId) return;
        const cloId = cloEvaluation.cloId.toString();
        if (cloData[cloId]) {
          cloData[cloId].sum += evaluation.obtainedCLOPercentage || 0;
          cloData[cloId].count += 1;
          cloData[cloId].totalCLOPercentage = evaluation.totalCLOPercentage || 0;
        }
      });
    });
  });

  const obtainedAverageofCLO = [];
  for (const cloId in cloData) {
    const { sum, count, totalCLOPercentage } = cloData[cloId];
    obtainedAverageofCLO.push({
      cloId,
      averageCLOPercentage: count > 0 ? sum / count : 0,
      totalCLOPercentage,
    });
  }

  return obtainedAverageofCLO;
};

const calculateEvaluations = async (evaluations, examWeightage) => {
  const evalsWithQuestions = await Promise.all(
    evaluations.map(async (evalItem) => {
      const totalCLOPercentage = examWeightage / (evaluations.length || 1);
      let totalObtainedMarks = 0;
      let totalMarks = 0;

      const cloEvaluations = evalItem.cloEvaluations ? await Promise.all(
        evalItem.cloEvaluations.map(async (cloEval) => {
          let totalQuestionMarks = 0;
          let totalObtainedMarksQuestions = 0;
          let questionWeightage = 0;

          const questions = cloEval.questions ? await Promise.all(
            cloEval.questions.map(async (question) => {
              const quest = await getQuestionDetails(question.questionId);
              questionWeightage = quest.marks;
              const obtainedMarks = question.marks;
              totalQuestionMarks += questionWeightage;
              totalObtainedMarksQuestions += obtainedMarks;

              return {
                questionId: question.questionId,
                marks: obtainedMarks,
                obtainedPercentage: obtainedMarks,
              };
            })
          ) : [];

          totalObtainedMarks += totalObtainedMarksQuestions;
          totalMarks += totalQuestionMarks;

          return {
            cloId: cloEval.cloId,
            questions,
            totalPercentage: questionWeightage,
            obtainedPercentage: 0,
          };
        })
      ) : [];

      return {
        cloForExamId: evalItem.cloForExamId,
        cloEvaluations,
        totalCLOPercentage,
        obtainedCLOPercentage: totalMarks > 0 ? (totalObtainedMarks / totalMarks) * totalCLOPercentage : 0,
      };
    })
  );

  return evalsWithQuestions;
};

// Evaluate Handlers
const addEvaluationMarks = async (req, res) => {
  try {
    const {
      groupId,
      termId,
      examId,
      examinerId,
      evaluations,
      feedback,
      panelId,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(termId)) {
      return res.status(400).json({ error: "Invalid termId format" });
    }

    const exam = await CreateExam.findById(examId).populate("ExamType CLOForExams");
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const examName = exam.ExamType.examName;
    const examTypeFor = exam.ExamType.examTypeFor;

    let containsCLO = false;
    if (exam.CLOForExams) {
      const CLOForExamsDoc = await CLOForExam.findById(exam.CLOForExams).populate("CLOs");
      if (CLOForExamsDoc && CLOForExamsDoc.CLOs.length > 0) {
        containsCLO = true;
      }
    }

    const groupRegistration = await FypRegistration.findById(groupId);
    if (!groupRegistration) {
      return res.status(404).json({ error: "FYP Group registration not found" });
    }
    const supervisorId = groupRegistration.selectedOption;

    const termEvaluation = await Evaluation.findOne({
      supervisorId,
      "terms.termId": termId,
      "terms.exams.examId": examId,
    });

    if (termEvaluation) {
      const specificTerm = termEvaluation.terms.find((t) => t.termId.toString() === termId.toString());
      if (specificTerm) {
        const examEvaluation = specificTerm.exams.find((e) => e.examId.toString() === examId.toString());
        if (examEvaluation) {
          const groupEval = examEvaluation.fypGroups.find((g) => g.groupId.toString() === groupId.toString());
          if (groupEval) {
            const marked = groupEval.students.find((s) =>
              s.evaluationsByExaminers.some((e) => e.examinerId.toString() === examinerId.toString())
            );
            if (marked) {
              return res.status(400).json({ error: "Already marked by this examiner", message: "Already Marked" });
            }
          }
        }
      }
    }

    let evaluationResult;
    if (containsCLO) {
      evaluationResult = await handleEvaluationWithCLOs(
        groupId, termId, examId, examName, examTypeFor,
        examinerId, evaluations, exam.ExamWeightage, feedback, panelId, supervisorId
      );
    } else {
      const examType = await getExamTypeName(exam.ExamType);
      evaluationResult = await handleEvaluationWithoutCLOs(
        groupId, termId, examId, examName, examTypeFor,
        examinerId, evaluations, examType, exam.ExamWeightage, supervisorId
      );
    }

    res.status(200).json({ message: "Marks added successfully", evaluation: evaluationResult });
  } catch (error) {
    console.error("Error adding marks:", error);
    res.status(500).json({ error: "Failed to add marks: " + error.message });
  }
};

const handleEvaluationWithCLOs = async (
  groupId, termId, examId, examName, examTypeFor,
  examinerId, evaluations, examWeightage, feedback, panelId, supervisorId
) => {
  try {
    let term = await Evaluation.findOne({ supervisorId });

    if (!term) {
      term = new Evaluation({
        supervisorId,
        terms: [{
          termId,
          exams: [{
            examId, examName, examTypeFor,
            fypGroups: [{
              groupId, panelId,
              students: await Promise.all(evaluations.map(async (student) => ({
                studentId: student.studentId,
                evaluationsByExaminers: [{
                  examinerId,
                  evaluations: student.evaluations ? await calculateEvaluations(student.evaluations, examWeightage) : [],
                  marks: student.marks || 0,
                  feedback: feedback || "",
                }],
                obtainedAverage: 0,
                obtainedAverageofCLO: [],
              })))
            }]
          }]
        }]
      });
    } else {
      let specificTerm = term.terms.find((t) => t.termId.toString() === termId.toString());
      if (!specificTerm) {
        specificTerm = {
          termId,
          exams: [{
            examId, examName, examTypeFor,
            fypGroups: [{
              groupId, panelId,
              students: await Promise.all(evaluations.map(async (student) => ({
                studentId: student.studentId,
                evaluationsByExaminers: [{
                  examinerId,
                  evaluations: student.evaluations ? await calculateEvaluations(student.evaluations, examWeightage) : [],
                  marks: student.marks || 0,
                  feedback: feedback || "",
                }],
                obtainedAverage: 0,
                obtainedAverageofCLO: [],
              })))
            }]
          }]
        };
        term.terms.push(specificTerm);
      } else {
        let exam = specificTerm.exams.find((e) => e.examId.toString() === examId.toString());
        if (!exam) {
          specificTerm.exams.push({
            examId, examName, examTypeFor,
            fypGroups: [{
              groupId, panelId,
              students: await Promise.all(evaluations.map(async (student) => ({
                studentId: student.studentId,
                evaluationsByExaminers: [{
                  examinerId,
                  evaluations: student.evaluations ? await calculateEvaluations(student.evaluations, examWeightage) : [],
                  marks: student.marks || 0,
                  feedback: feedback || "",
                }],
                obtainedAverage: 0,
                obtainedAverageofCLO: [],
              })))
            }]
          });
        } else {
          let group = exam.fypGroups.find((g) => g.groupId.toString() === groupId.toString());
          if (!group) {
            exam.fypGroups.push({
              groupId, panelId,
              students: await Promise.all(evaluations.map(async (student) => ({
                studentId: student.studentId,
                evaluationsByExaminers: [{
                  examinerId,
                  evaluations: student.evaluations ? await calculateEvaluations(student.evaluations, examWeightage) : [],
                  marks: student.marks || 0,
                  feedback: feedback || "",
                }],
                obtainedAverage: 0,
                obtainedAverageofCLO: [],
              })))
            });
          } else {
            await Promise.all(evaluations.map(async (student) => {
              let studentDoc = group.students.find((s) => s.studentId.toString() === student.studentId.toString());
              if (!studentDoc) {
                group.students.push({
                  studentId: student.studentId,
                  evaluationsByExaminers: [{
                    examinerId,
                    evaluations: student.evaluations ? await calculateEvaluations(student.evaluations, examWeightage) : [],
                    marks: student.marks || 0,
                    feedback: feedback || "",
                  }],
                  obtainedAverage: 0,
                  obtainedAverageofCLO: [],
                });
              } else {
                let examinerEval = studentDoc.evaluationsByExaminers.find((e) => e.examinerId.toString() === examinerId.toString());
                if (!examinerEval) {
                  studentDoc.evaluationsByExaminers.push({
                    examinerId,
                    evaluations: student.evaluations ? await calculateEvaluations(student.evaluations, examWeightage) : [],
                    marks: student.marks || 0,
                    feedback: feedback || "",
                  });
                }
              }
            }));
          }
        }
      }
    }

    // Refresh averages
    term.terms?.forEach((t) => {
      t.exams?.forEach((e) => {
        if (["Attendance-I", "Attendance-II", "Orientation"].includes(e.examName)) return;
        e.fypGroups?.forEach((g) => {
          g.students?.forEach((s) => {
            const totalMarks = s.evaluationsByExaminers?.reduce((sum, examiner) => {
              const obtained = examiner.evaluations?.reduce((cloSum, clo) => cloSum + (clo.obtainedCLOPercentage || 0), 0) || 0;
              return sum + obtained;
            }, 0) || 0;
            s.obtainedAverage = totalMarks / (s.evaluationsByExaminers?.length || 1);
            s.obtainedAverageofCLO = calculateAverageCLOPercentage(s);
          });
        });
      });
    });

    await PanelDetails.updateOne(
      { "PanelMembers.member": examinerId },
      { $set: { "PanelMembers.$.evaluationStatus": "marked" } }
    );

    await term.save();
    return term;
  } catch (error) {
    console.error("Error in handler:", error);
    throw error;
  }
};

const handleEvaluationWithoutCLOs = async (
  groupId, termId, examId, examName, examTypeFor,
  examinerId, evaluations, examType, examWeightage, supervisorId
) => {
  if (["Attendance-I", "Attendance-II", "Final Defense"].includes(examType)) {
    return await storeMarksForAttendance(groupId, termId, examId, examName, examTypeFor, evaluations, examinerId, examWeightage, supervisorId);
  } else if (examType === "Orientation") {
    return await storeMarksForOrientation(groupId, termId, examId, examName, examTypeFor, evaluations, examinerId, examWeightage, supervisorId);
  } else {
    throw new Error("Invalid exam type: " + examType);
  }
};

const storeMarksForAttendance = async (
  groupId, termId, examId, examName, examTypeFor, evaluations, examinerId, examWeightage, supervisorId
) => {
  let term = await Evaluation.findOne({ supervisorId });
  const marks = evaluations.map(e => ({ studentId: e.studentId, marks: e.marks }));

  if (!term) {
    term = new Evaluation({
      supervisorId,
      terms: [{
        termId,
        exams: [{
          examId, examName, examTypeFor,
          fypGroups: [{
            groupId,
            students: marks.map(m => ({
              studentId: m.studentId,
              evaluationsByExaminers: [{ examinerId, marks: m.marks, totalWeightage: examWeightage }]
            }))
          }]
        }]
      }]
    });
  } else {
    let specificTerm = term.terms.find(t => t.termId.toString() === termId.toString());
    if (!specificTerm) {
      specificTerm = {
        termId,
        exams: [{
          examId, examName, examTypeFor,
          fypGroups: [{
            groupId,
            students: marks.map(m => ({
              studentId: m.studentId,
              evaluationsByExaminers: [{ examinerId, marks: m.marks, totalWeightage: examWeightage }]
            }))
          }]
        }]
      };
      term.terms.push(specificTerm);
    } else {
      let exam = specificTerm.exams.find(e => e.examId.toString() === examId.toString());
      if (!exam) {
        exam = {
          examId, examName, examTypeFor,
          fypGroups: [{
            groupId,
            students: marks.map(m => ({
              studentId: m.studentId,
              evaluationsByExaminers: [{ examinerId, marks: m.marks, totalWeightage: examWeightage }]
            }))
          }]
        };
        specificTerm.exams.push(exam);
      } else {
        let group = exam.fypGroups.find(g => g.groupId.toString() === groupId.toString());
        if (!group) {
          group = {
            groupId,
            students: marks.map(m => ({
              studentId: m.studentId,
              evaluationsByExaminers: [{ examinerId, marks: m.marks, totalWeightage: examWeightage }]
            }))
          };
          exam.fypGroups.push(group);
        } else {
          marks.forEach(m => {
            let studentDoc = group.students.find(s => s.studentId.toString() === m.studentId.toString());
            if (!studentDoc) {
              group.students.push({
                studentId: m.studentId,
                evaluationsByExaminers: [{ examinerId, marks: m.marks, totalWeightage: examWeightage }]
              });
            } else {
              let evalObj = studentDoc.evaluationsByExaminers.find(e => e.examinerId.toString() === examinerId.toString());
              if (!evalObj) {
                studentDoc.evaluationsByExaminers.push({ examinerId, marks: m.marks, totalWeightage: examWeightage });
              } else {
                evalObj.marks = m.marks;
              }
            }
          });
        }
      }
    }
  }

  // Refresh Attendance averages
  const foundTerm = term.terms.find(t => t.termId.toString() === termId.toString());
  const currentExam = foundTerm?.exams.find(e => e.examId.toString() === examId.toString());
  currentExam?.fypGroups?.forEach(g => {
    g.students?.forEach(s => {
      const total = s.evaluationsByExaminers?.reduce((sum, e) => sum + (e.marks || 0), 0) || 0;
      s.obtainedAverage = total / (s.evaluationsByExaminers?.length || 1);
    });
  });

  await term.save();
  return term;
};

const storeMarksForOrientation = async (
  groupId, termId, examId, examName, examTypeFor, evaluations, examinerId, examWeightage, supervisorId
) => {
  let term = await Evaluation.findOne({ supervisorId });
  const marks = evaluations.map(e => ({ studentId: e.studentId, marks: e.marks }));

  if (!term) {
    term = new Evaluation({
      supervisorId,
      terms: [{
        termId,
        exams: [{
          examId, examName, examTypeFor,
          fypGroups: [{
            groupId,
            students: marks.map(m => ({
              studentId: m.studentId,
              evaluationsByExaminers: [{ examinerId, marks: m.marks, totalWeightage: examWeightage }]
            }))
          }]
        }]
      }]
    });
  } else {
    let specificTerm = term.terms.find(t => t.termId.toString() === termId.toString());
    if (!specificTerm) {
      specificTerm = {
        termId,
        exams: [{
          examId, examName, examTypeFor,
          fypGroups: [{
            groupId,
            students: marks.map(m => ({
              studentId: m.studentId,
              evaluationsByExaminers: [{ examinerId, marks: m.marks, totalWeightage: examWeightage }]
            }))
          }]
        }]
      };
      term.terms.push(specificTerm);
    } else {
      let exam = specificTerm.exams.find(e => e.examId.toString() === examId.toString());
      if (!exam) {
        specificTerm.exams.push({
          examId, examName, examTypeFor,
          fypGroups: [{
            groupId,
            students: marks.map(m => ({
              studentId: m.studentId,
              evaluationsByExaminers: [{ examinerId, marks: m.marks, totalWeightage: examWeightage }]
            }))
          }]
        });
      } else {
        let group = exam.fypGroups.find(g => g.groupId.toString() === groupId.toString());
        if (!group) {
          exam.fypGroups.push({
            groupId,
            students: marks.map(m => ({
              studentId: m.studentId,
              evaluationsByExaminers: [{ examinerId, marks: m.marks, totalWeightage: examWeightage }]
            }))
          });
        } else {
          marks.forEach(m => {
            let studentDoc = group.students.find(s => s.studentId.toString() === m.studentId.toString());
            if (!studentDoc) {
              group.students.push({
                studentId: m.studentId,
                evaluationsByExaminers: [{ examinerId, marks: m.marks, totalWeightage: examWeightage }]
              });
            } else {
              let evalObj = studentDoc.evaluationsByExaminers.find(e => e.examinerId.toString() === examinerId.toString());
              if (!evalObj) {
                studentDoc.evaluationsByExaminers.push({ examinerId, marks: m.marks, totalWeightage: examWeightage });
              } else {
                evalObj.marks = m.marks;
              }
            }
          });
        }
      }
    }
  }

  await term.save();
  return term;
};

// Fetch Handlers
const fetchAllExamOfGroup = async (req, res) => {
  try {
    let { termId, groupId } = req.params;
    if (!groupId && req.query.groupId) groupId = req.query.groupId;
    const evaluations = await Evaluation.find({ "terms.termId": termId });
    let groupExams = [];
    evaluations.forEach(ev => {
      const t = ev.terms.find(t => t.termId.toString() === termId);
      if (t) {
        t.exams.forEach(ex => {
          const g = ex.fypGroups.find(g => g.groupId.toString() === groupId);
          if (g) groupExams.push({ examId: ex.examId, students: g.students });
        });
      }
    });
    res.status(200).json({ groupExams });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getEvaluationMarks = async (req, res) => {
  try {
    const { supervisorId, termId } = req.params;
    const evaluation = await Evaluation.findOne({ supervisorId })
      .populate("terms.termId terms.exams.examId terms.exams.fypGroups.groupId terms.exams.fypGroups.students.studentId");
    if (!evaluation) return res.status(404).json({ error: "Not found" });
    const term = evaluation.terms.find(t => t.termId && t.termId._id.toString() === termId);
    res.status(200).json({ evaluation: term });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const fetchTermEvaluationDetails = async (termId) => {
  const evaluations = await Evaluation.find({ "terms.termId": termId })
    .populate("terms.exams.examId terms.exams.fypGroups.students.studentId terms.exams.fypGroups.students.evaluationsByExaminers.examinerId");
  // Simplified logic for brevity, matches old functionality but schema-compliant
  return evaluations.flatMap(ev => {
    const t = ev.terms.find(t => t.termId.toString() === termId);
    return t ? t.exams.flatMap(ex => ex.fypGroups.flatMap(g => g.students.map(s => ({
      name: s.studentId.name,
      registrationNumber: s.studentId.registrationNumber,
      examName: ex.examName,
      obtainedAverage: s.obtainedAverage
    })))) : [];
  });
};

const getExamEvaluationDetailsbyTerm = async (req, res) => {
  try {
    const details = await fetchTermEvaluationDetails(req.params.termId);
    res.status(200).json({ evaluation: { evaluations: details } });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = {
  getEvaluationMarks,
  addEvaluationMarks,
  fetchAllExamOfGroup,
  fetchTermEvaluationDetails,
  getExamEvaluationDetailsbyTerm,
};
\`;

fs.writeFileSync(filePath, content, 'utf8');
console.log('EvaluateExamCont.js fully reconstructed.');
