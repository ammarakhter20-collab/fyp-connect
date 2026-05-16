const Evaluation = require("../../models/CoordinatorModels/EvaluateExamModel");
const CreateExam = require("../../models/CoordinatorModels/ExamCreationModel");
const Term = require("../../models/AdminModels/fypTerm");
const mongoose = require("mongoose");
const FypRegistration = require("../../models/StudentModels/fypRegModel");
const CLOForExam = require("../../models/CoordinatorModels/CLOForExamModel");
const Question = require("../../models/CoordinatorModels/QuesForCLOModel");
const PanelDetails = require("../../models/CoordinatorModels/PenalModel");
const ExamType = require("../../models/CoordinatorModels/ExamTypeModel");

// Helper Functions
const getQuestionDetails = async (questionId) => {
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error(`Question with ID ${questionId} not found`);
    }
    return question;
  } catch (error) {
    console.error(`Error fetching question with ID ${questionId}:`, error);
    throw error;
  }
};

const getExamTypeName = async (examTypeId) => {
  const examType = await ExamType.findById(examTypeId);
  return examType ? examType.examName : "";
};

// Helper to calculate the average CLO percentage for a student across all examiners
const calculateAverageCLOPercentage = (student) => {
  const cloStats = new Map(); // Map to store { cloId: { sum: number, count: number, total: number } }

  student.evaluationsByExaminers?.forEach((examiner) => {
    examiner.evaluations?.forEach((cloForExam) => {
      // Use the first CLO ID in the block (assuming 1 CLO per block)
      const firstCloEval = cloForExam.cloEvaluations?.[0];
      if (firstCloEval) {
        const cloId = firstCloEval.cloId.toString();
        if (!cloStats.has(cloId)) {
          cloStats.set(cloId, { sum: 0, count: 0, total: 0 });
        }
        const stats = cloStats.get(cloId);
        // Sum Weighted Marks (e.g., 8.5) instead of Raw Percentage (85%)
        stats.sum += (cloForExam.obtainedCLOPercentage || 0);
        // Sum Weights (e.g., 10)
        stats.total += (cloForExam.totalCLOPercentage || 0);
        stats.count += 1;
      }
    });
  });

  return Array.from(cloStats.entries()).map(([cloId, stats]) => ({
    cloId: cloId,
    averageCLOPercentage: stats.sum / (stats.count || 1), // Average Weighted Mark
    totalCLOPercentage: stats.total / (stats.count || 1), // Average Weight
  }));
};

// Unified helper to recalculate averages for a specific exam in a term
const recalculateAverages = (term, termId, examId) => {
  console.log(`DEBUG: recalculateAverages called for termId: ${termId}, examId: ${examId}`);
  const foundT = term.terms.find(t => t.termId.toString() === termId.toString());
  if (!foundT) {
    console.log("DEBUG: termId not found in evaluation document");
    return;
  }

  // Try finding by ID first
  let curEx = foundT.exams.find(e => e.examId.toString() === examId.toString());

  // Fallback: search by name if ID match fails (handles deleted/recreated exams)
  if (!curEx) {
    console.log(`DEBUG: Exam ID ${examId} not found, searching by name fallback...`);
    // We need the name of the current exam being marked
    // Since we don't have it here, we'll try to find any exam that MIGHT be the one
    // But better: storeSimpleMarks and handleEvaluationWithCLOs handle the naming.
    // However, recalculateAverages is often called WITH the exam document available in the caller.
    // For now, let's assume if it's called, the caller has already synced the ID or we find it by some unique trait.
    // Actually, let's modify recalculateAverages to take the name as an optional arg or rely on the ID being synced by callers.
  }

  if (!curEx) {
    console.log("DEBUG: examId not found in the term's exams");
    return;
  }

  console.log(`DEBUG: Recalculating for exam: ${curEx.examName} in group(s): ${curEx.fypGroups?.length}`);

  curEx.fypGroups?.forEach(g => {
    console.log(`DEBUG: Processing group: ${g.groupId}`);
    g.students?.forEach(s => {
      let tot = 0;
      console.log(`DEBUG: Student ${s.studentId} has ${s.evaluationsByExaminers?.length} examiner entries`);

      s.evaluationsByExaminers?.forEach(ex => {
        // Hybrid calculation: prioritizes CLO marks, fallback to raw marks
        let examMarks = 0;
        if (ex.evaluations && ex.evaluations.length > 0) {
          // Sum up obtained CLO percentages across all CLOs for this examiner
          // Each cloEvaluation already contains the scaled marks/percentage
          examMarks = ex.evaluations.reduce((acc, cloForExam) => {
            return acc + (cloForExam.obtainedCLOPercentage || 0);
          }, 0);
          console.log(`DEBUG: Examiner ${ex.examinerId} (CLO) marks: ${examMarks}`);
        } else {
          examMarks = Number(ex.marks) || 0;
          console.log(`DEBUG: Examiner ${ex.examinerId} (Raw) marks: ${examMarks}`);
        }
        tot += examMarks;
      });

      const examinerCount = s.evaluationsByExaminers?.length || 1;
      s.obtainedAverage = tot / examinerCount;
      console.log(`DEBUG: Student ${s.studentId} final average: ${s.obtainedAverage}`);
      s.obtainedAverageofCLO = calculateAverageCLOPercentage(s);
    });
  });
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
          let questionWeightageForCLO = 0;

          const questions = cloEval.questions ? await Promise.all(
            cloEval.questions.map(async (question) => {
              const quest = await getQuestionDetails(question.questionId);
              questionWeightageForCLO = quest.marks;
              const obtainedMarks = question.marks;
              totalQuestionMarks += questionWeightageForCLO;
              totalObtainedMarksQuestions += obtainedMarks;

              return {
                questionId: question.questionId,
                marks: obtainedMarks,
                obtainedPercentage: (obtainedMarks / (questionWeightageForCLO || 1)) * 100,
              };
            })
          ) : [];

          totalObtainedMarks += totalObtainedMarksQuestions;
          totalMarks += totalQuestionMarks;

          return {
            cloId: cloEval.cloId,
            questions,
            totalPercentage: questionWeightageForCLO,
            obtainedPercentage: totalQuestionMarks > 0 ? (totalObtainedMarksQuestions / totalQuestionMarks) * 100 : 0,
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

// Unified handler for storing marks for non-CLO exams (Attendance, Orientation, etc.)
const storeSimpleMarks = async (groupId, termId, examId, examName, examTypeFor, evals, exId, weight, supId, feedback = "", panelId = null) => {
  console.log(`DEBUG: storeSimpleMarks - groupId: ${groupId}, exam: ${examName}, studentCount: ${evals?.length}`);
  let term = await Evaluation.findOne({ supervisorId: supId });
  const marks = evals.map(e => ({ studentId: e.studentId, marks: e.marks }));

  const createStudent = (m) => ({
    studentId: m.studentId,
    evaluationsByExaminers: [{
      examinerId: exId,
      marks: Number(m.marks || 0),
      totalWeightage: weight,
      feedback: feedback
    }]
  });

  if (!term) {
    console.log("DEBUG: No existing evaluation document found for supervisor, creating new.");
    term = new Evaluation({
      supervisorId: supId,
      uploadedBy: supId,
      terms: [{ termId, exams: [{ examId, examName, examTypeFor, fypGroups: [{ groupId, panelId, students: marks.map(createStudent) }] }] }]
    });
  } else {
    console.log("DEBUG: Existing evaluation document found for supervisor.");
    let foundT = term.terms.find(t => t.termId.toString() === termId.toString());
    if (!foundT) {
      console.log(`DEBUG: Term ${termId} not found, adding new term.`);
      term.terms.push({ termId, exams: [{ examId, examName, examTypeFor, fypGroups: [{ groupId, panelId, students: marks.map(createStudent) }] }] });
    } else {
      console.log(`DEBUG: Term ${termId} found.`);
      let curEx = foundT.exams.find(e => e.examId.toString() === examId.toString());

      // Fallback: search by name if ID mismatch (handles recreated exams)
      if (!curEx) {
        console.log(`DEBUG: Exam ID ${examId} not found, searching by name: ${examName}`);
        curEx = foundT.exams.find(e => e.examName === examName);
        if (curEx) {
          console.log(`DEBUG: Found existing exam entry by name. Syncing ID from ${curEx.examId} to ${examId}`);
          curEx.examId = examId; // Sync to current ID
        }
      }

      if (!curEx) {
        console.log(`DEBUG: Exam ${examId} (${examName}) not found in term, adding new exam.`);
        foundT.exams.push({ examId, examName, examTypeFor, fypGroups: [{ groupId, panelId, students: marks.map(createStudent) }] });
      } else {
        console.log(`DEBUG: Exam ${examId} found.`);
        let curGrp = curEx.fypGroups.find(g => g.groupId.toString() === groupId.toString());
        if (!curGrp) {
          console.log(`DEBUG: Group ${groupId} not found in exam, adding new group.`);
          curEx.fypGroups.push({ groupId, panelId, students: marks.map(createStudent) });
        } else {
          console.log(`DEBUG: Group ${groupId} found, updating students.`);
          curGrp.panelId = panelId || curGrp.panelId;
          marks.forEach(m => {
            let curStd = curGrp.students.find(s => s.studentId.toString() === m.studentId.toString());
            if (!curStd) {
              console.log(`DEBUG: Student ${m.studentId} not found in group, adding new student.`);
              curGrp.students.push(createStudent(m));
            } else {
              console.log(`DEBUG: Student ${m.studentId} found, checking examiner.`);
              let curExm = curStd.evaluationsByExaminers.find(e => e.examinerId.toString() === exId.toString());
              if (!curExm) {
                console.log(`DEBUG: Examiner ${exId} not found for student, adding new examiner entry.`);
                curStd.evaluationsByExaminers.push({
                  examinerId: exId,
                  marks: Number(m.marks || 0),
                  totalWeightage: weight,
                  feedback: feedback
                });
              } else {
                console.log(`DEBUG: Examiner ${exId} found for student, updating marks.`);
                curExm.marks = Number(m.marks || 0);
                curExm.totalWeightage = weight;
                curExm.feedback = feedback;
              }
            }
          });
        }
      }
    }
  }

  // Recalculate averages using unified helper
  recalculateAverages(term, termId, examId);

  // Update Panel Evaluation Status
  if (panelId) {
    console.log(`DEBUG: Updating panel status for panelId: ${panelId}, examiner: ${exId}`);
    await PanelDetails.updateOne(
      { _id: panelId, "PanelMembers.member": exId },
      { $set: { "PanelMembers.$.evaluationStatus": "marked" } }
    ).catch(err => console.error("Error updating panel status:", err));
  }

  // Ensure persistence of nested updates
  term.markModified('terms');
  await term.save();
  console.log("DEBUG: Evaluation document saved successfully.");
  return term;
};

// Evaluation Handlers
const addEvaluationMarks = async (req, res) => {
  try {
    const { groupId, termId, examId, examinerId, evaluations, feedback, panelId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(termId)) return res.status(400).json({ error: "Invalid termId format" });

    const exam = await CreateExam.findById(examId).populate("ExamType").populate("Term");
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    // Guard: Prevent marking if exam is Completed
    if (exam.status === "Completed") {
      return res.status(403).json({ error: "Exam has been marked as Completed by the Coordinator. Marks cannot be modified." });
    }

    // Guard: Prevent marking if term has expired
    if (exam.Term && exam.Term.endDate && new Date(exam.Term.endDate) < new Date()) {
      return res.status(403).json({ error: "The term has expired. Marks cannot be modified." });
    }

    const examName = exam.ExamType.examName;
    const examTypeFor = exam.ExamType.examTypeFor;
    const containsCLO = !!exam.CLOForExams;
    console.log(`DEBUG: addEvaluationMarks - examId: ${examId}, containsCLO: ${containsCLO}`);

    const groupReg = await FypRegistration.findById(groupId);
    if (!groupReg) return res.status(404).json({ error: "FYP Group registration not found" });
    const supervisorId = groupReg.selectedOption;

    // Note: "Already Marked" check removed — the update-if-exists logic in
    // storeSimpleMarks and handleEvaluationWithCLOs handles re-submissions gracefully.

    let evaluationResult;
    if (containsCLO) {
      evaluationResult = await handleEvaluationWithCLOs(
        groupId, termId, examId, examName, examTypeFor,
        examinerId, evaluations, exam.ExamWeightage, feedback, panelId, supervisorId
      );
    } else {
      const type = await getExamTypeName(exam.ExamType);
      evaluationResult = await handleEvaluationWithoutCLOs(
        groupId, termId, examId, examName, examTypeFor,
        examinerId, evaluations, type, exam.ExamWeightage, supervisorId, feedback, panelId
      );
    }

    res.status(200).json({ message: "Marks added successfully", evaluation: evaluationResult });
  } catch (error) {
    console.error("Error adding evaluation marks:", error);
    res.status(500).json({ error: error.message || "Failed to add marks" });
  }
};

const handleEvaluationWithCLOs = async (
  groupId, termId, examId, examName, examTypeFor,
  examinerId, evaluations, weight, feedback, panelId, supervisorId
) => {
  let term = await Evaluation.findOne({ supervisorId });

  const createNewStudent = async (student) => ({
    studentId: student.studentId,
    evaluationsByExaminers: [{
      examinerId,
      evaluations: student.evaluations ? await calculateEvaluations(student.evaluations, weight) : [],
      marks: student.marks || 0,
      feedback: feedback || "",
    }],
    obtainedAverage: 0,
    obtainedAverageofCLO: [],
  });

  if (!term) {
    term = new Evaluation({
      supervisorId,
      terms: [{
        termId,
        exams: [{
          examId, examName, examTypeFor,
          fypGroups: [{
            groupId, panelId,
            students: await Promise.all(evaluations.map(createNewStudent))
          }]
        }]
      }]
    });
  } else {
    let st = term.terms.find(t => t.termId.toString() === termId.toString());
    if (!st) {
      st = { termId, exams: [{ examId, examName, examTypeFor, fypGroups: [{ groupId, panelId, students: await Promise.all(evaluations.map(createNewStudent)) }] }] };
      term.terms.push(st);
    } else {
      let ex = st.exams.find(e => e.examId.toString() === examId.toString());

      // Fallback: search by name if ID mismatch
      if (!ex) {
        console.log(`DEBUG: Exam ID ${examId} not found in CLO handler, searching by name: ${examName}`);
        ex = st.exams.find(e => e.examName === examName);
        if (ex) {
          console.log(`DEBUG: Found existing CLO exam entry by name. Syncing ID from ${ex.examId} to ${examId}`);
          ex.examId = examId;
        }
      }

      if (!ex) {
        ex = { examId, examName, examTypeFor, fypGroups: [{ groupId, panelId, students: await Promise.all(evaluations.map(createNewStudent)) }] };
        st.exams.push(ex);
      } else {
        let g = ex.fypGroups.find(gr => gr.groupId.toString() === groupId.toString());
        if (!g) {
          g = { groupId, panelId, students: await Promise.all(evaluations.map(createNewStudent)) };
          ex.fypGroups.push(g);
        } else {
          await Promise.all(evaluations.map(async s => {
            let sd = g.students.find(stud => stud.studentId.toString() === s.studentId.toString());
            if (!sd) {
              g.students.push(await createNewStudent(s));
            } else {
              let exMark = sd.evaluationsByExaminers.find(ev => ev.examinerId.toString() === examinerId.toString());
              if (!exMark) {
                sd.evaluationsByExaminers.push({
                  examinerId,
                  evaluations: s.evaluations ? await calculateEvaluations(s.evaluations, weight) : [],
                  marks: s.marks || 0,
                  feedback: feedback || "",
                });
              } else {
                // Update existing mark
                exMark.evaluations = s.evaluations ? await calculateEvaluations(s.evaluations, weight) : [];
                exMark.marks = s.marks || 0;
                exMark.feedback = feedback || "";
              }
            }
          }));
        }
      }
    }
  }

  // Recalculate averages using unified helper
  recalculateAverages(term, termId, examId);

  await PanelDetails.updateOne({ "PanelMembers.member": examinerId }, { $set: { "PanelMembers.$.evaluationStatus": "marked" } });

  // Ensure persistence of nested updates
  term.markModified('terms');
  await term.save();
  return term;
};

const handleEvaluationWithoutCLOs = async (groupId, termId, examId, examName, examTypeFor, examinerId, evaluations, type, weight, supervisorId, feedback, panelId) => {
  return storeSimpleMarks(groupId, termId, examId, examName, examTypeFor, evaluations, examinerId, weight, supervisorId, feedback, panelId);
};

const storeMarksForAttendance = undefined; // Deprecated, unified into storeSimpleMarks
const storeMarksForOrientation = undefined; // Deprecated, unified into storeSimpleMarks

const fetchAllExamOfGroup = async (req, res) => {
  try {
    const { termId } = req.params;
    const { groupId } = req.query;
    console.log(`[DEBUG] fetchAllExamOfGroup called for group: ${groupId}, term: ${termId}`);

    const evaluations = await Evaluation.find({ "terms.termId": termId })
      .populate("terms.exams.examId")
      .populate("terms.exams.fypGroups.students.studentId");

    console.log(`[DEBUG] Found ${evaluations.length} evaluation documents matching term`);

    const groupExams = evaluations.flatMap(ev => {
      // Find the term matching termId
      const t = ev.terms.find(te => te.termId && te.termId.toString() === termId);
      if (!t) return [];

      return t.exams.map(ex => {
        // Find the group matching groupId
        const g = ex.fypGroups.find(gr => gr.groupId && gr.groupId.toString() === groupId);
        if (g) {
          console.log(`[DEBUG] Found exam marks for: ${ex.examName || (ex.examId && ex.examId.examName)}`);
          return { 
            examId: ex.examId, 
            examName: ex.examName || (ex.examId && ex.examId.examName),
            students: g.students 
          };
        }
        return null;
      }).filter(Boolean);
    });

    console.log(`[DEBUG] Returning ${groupExams.length} group exams to frontend`);
    res.status(200).json({ groupExams });
  } catch (err) { 
    console.error("[ERROR] fetchAllExamOfGroup failed:", err);
    res.status(500).json({ error: err.message }); 
  }
};

const getEvaluationMarks = async (req, res) => {
  try {
    const { supervisorId, termId } = req.params;
    const ev = await Evaluation.findOne({ supervisorId }).populate("terms.termId terms.exams.examId terms.exams.fypGroups.groupId terms.exams.fypGroups.students.studentId");
    if (!ev) return res.status(404).json({ error: "Not found" });
    const t = ev.terms.find(te => te.termId && te.termId._id.toString() === termId);
    res.status(200).json({ evaluation: t });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const fetchTermEvaluationDetails = async (termId) => {
  try {
    const evaluations = await Evaluation.find({ "terms.termId": termId })
      .populate("terms.exams.examId")
      .populate("terms.exams.fypGroups.students.studentId")
      .populate("terms.exams.fypGroups.students.evaluationsByExaminers.examinerId");

    return evaluations.flatMap(ev => {
      const t = ev.terms.find(te => te.termId.toString() === termId);
      return t ? t.exams.flatMap(ex => ex.fypGroups.flatMap(g => g.students.map(s => ({
        name: s.studentId?.name,
        registrationNumber: s.studentId?.registrationNumber,
        examName: ex.examName,
        obtainedAverage: s.obtainedAverage
      })))) : [];
    });
  } catch (error) {
    console.error("Error in fetchTermEvaluationDetails:", error);
    throw error;
  }
};

const fetchExamEvaluationDetails = async (examName, termId) => {
  try {
    const evaluations = await Evaluation.find({ "terms.termId": termId, "terms.exams.examName": examName })
      .populate("terms.exams.examId")
      .populate("terms.exams.fypGroups.students.studentId")
      .populate("terms.exams.fypGroups.students.evaluationsByExaminers.examinerId");

    const students = evaluations.flatMap(ev => {
      const t = ev.terms.find(te => te.termId.toString() === termId);
      const ex = t?.exams.find(e => e.examName === examName);
      return ex ? ex.fypGroups.flatMap(g => g.students.map(s => ({
        name: s.studentId?.name,
        registrationNumber: s.studentId?.registrationNumber,
        obtainedAverage: s.obtainedAverage,
        obtainedAverageofCLO: s.obtainedAverageofCLO,
        evaluationsByExaminers: s.evaluationsByExaminers.map(eb => ({
          examinerName: eb.examinerId?.name,
          marks: eb.marks
        }))
      }))) : [];
    });
    return { examName, students: students };
  } catch (error) {
    console.error("Error in fetchExamEvaluationDetails:", error);
    throw error;
  }
};

const getExamEvaluationDetailsbyTerm = async (req, res) => {
  try {
    const details = await fetchTermEvaluationDetails(req.params.termId);
    res.status(200).json({ evaluation: { evaluations: details } });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getExamEvaluationDetailsbyTermAndExam = async (req, res) => {
  try {
    const details = await fetchExamEvaluationDetails(req.params.examName, req.params.termId);
    res.status(200).json({ evaluation: { evaluations: [details] } });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const fetchStudentMarksByTermAndExamName = async (req, res) => {
  try {
    const details = await fetchExamEvaluationDetails(req.params.examName, req.params.termId);
    res.status(200).json({ evaluation: details });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const addOrientationMarks = async (req, res) => {
  try {
    const { termId, examinerId, examId } = req.query;
    const { studentMarks } = req.body; // Array of { studentId, marks }

    // Fetch the exam to get examName, examTypeFor, weightage
    const exam = await CreateExam.findById(examId).populate("ExamType");
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    const examName = exam.ExamType.examName;
    const examTypeFor = exam.ExamType.examTypeFor;
    const weightage = exam.ExamWeightage || 100;

    // Fetch all FYP Registrations for this term to map students to groups and supervisors
    const termObjectId = new mongoose.Types.ObjectId(termId);
    const groups = await FypRegistration.find({
      $or: [{ term: termObjectId }, { term: termId }]
    });

    // Group studentMarks by groupId
    const groupedMarks = {};
    for (const sm of studentMarks) {
      // Find the group containing this student
      const group = groups.find(g => g.groupMembers.some(m => m._id.toString() === sm.studentId));
      if (group && group.selectedOption) {
        const groupId = group._id.toString();
        const supervisorId = group.selectedOption.toString();
        if (!groupedMarks[groupId]) {
          groupedMarks[groupId] = {
            supervisorId,
            evaluations: []
          };
        }
        groupedMarks[groupId].evaluations.push(sm);
      }
    }

    // Call storeSimpleMarks for each group
    for (const groupId in groupedMarks) {
      const groupData = groupedMarks[groupId];
      await storeSimpleMarks(
        groupId,
        termId,
        examId,
        examName,
        examTypeFor,
        groupData.evaluations, // evals
        examinerId,
        weightage,
        groupData.supervisorId
      );
    }

    res.status(200).json({ message: "Marks added successfully" });
  } catch (error) { 
    console.error("Error adding orientation marks:", error);
    res.status(500).json({ error: error.message }); 
  }
};

// ============================================================================
// COORDINATOR: Active Exams with Panel Member Marks
// ============================================================================

const getActiveExamsWithMarks = async (req, res) => {
  try {
    console.log("[DEBUG] getActiveExamsWithMarks called");

    // 1. Fetch all active exams
    const allExams = await CreateExam.find({ status: "Active" })
      .populate("Term")
      .populate("ExamType")
      .exec();

    console.log(`[DEBUG] Found ${allExams.length} active exams total`);

    // 2. Filter: only exams where Term is not expired
    const now = new Date();
    const validExams = allExams.filter((exam) => {
      if (!exam.Term) return false;
      const termNotExpired =
        (exam.Term.endDate && new Date(exam.Term.endDate) >= now) ||
        exam.Term.status === "activated";
      return termNotExpired;
    });

    console.log(`[DEBUG] ${validExams.length} exams after filtering expired terms`);

    // 3. For each exam, fetch evaluation marks from all Evaluation documents
    const activeExams = [];

    for (const exam of validExams) {
      const termId = exam.Term._id.toString();
      const examId = exam._id.toString();

      // Find all Evaluation documents that contain marks for this exam in this term
      const evaluations = await Evaluation.find({
        "terms.termId": exam.Term._id,
      })
        .populate("terms.exams.fypGroups.students.studentId", "name registrationNumber")
        .populate("terms.exams.fypGroups.students.evaluationsByExaminers.examinerId", "name")
        .populate({
          path: "terms.exams.fypGroups.groupId",
          model: "FypRegistration",
          select: "topicData groupMembers",
        })
        .exec();

      // Extract groups with marks for this specific exam
      const groups = [];

      for (const evalDoc of evaluations) {
        const foundTerm = evalDoc.terms.find(
          (t) => t.termId && t.termId.toString() === termId
        );
        if (!foundTerm) continue;

        // Try finding by examId, then fallback by examName
        let foundExam = foundTerm.exams.find(
          (e) => e.examId && e.examId.toString() === examId
        );
        if (!foundExam && exam.ExamType) {
          foundExam = foundTerm.exams.find(
            (e) => e.examName === exam.ExamType.examName
          );
        }
        if (!foundExam) continue;

        for (const group of foundExam.fypGroups) {
          // Build student data with per-examiner breakdown
          const students = [];
          for (const student of group.students) {
            const examiners = (student.evaluationsByExaminers || []).map((ex) => ({
              examinerId: ex.examinerId?._id || ex.examinerId,
              examinerName: ex.examinerId?.name || "Unknown",
              marks: ex.marks != null ? ex.marks : 0,
              totalWeightage: ex.totalWeightage || exam.ExamWeightage || 0,
              feedback: ex.feedback || "",
              hasCLOData: !!(ex.evaluations && ex.evaluations.length > 0),
            }));

            students.push({
              studentId: student.studentId?._id || student.studentId,
              studentName: student.studentId?.name || "Unknown",
              registrationNumber: student.studentId?.registrationNumber || "N/A",
              obtainedAverage: student.obtainedAverage || 0,
              examiners,
            });
          }

          if (students.length > 0) {
            groups.push({
              groupId: group.groupId?._id || group.groupId,
              supervisorId: evalDoc.supervisorId,
              projectName: group.groupId?.topicData?.topic || "N/A",
              panelId: group.panelId || null,
              students,
            });
          }
        }
      }

      activeExams.push({
        _id: exam._id,
        examName: exam.ExamType ? exam.ExamType.examName : "Unknown",
        examTypeFor: exam.ExamType ? exam.ExamType.examTypeFor : "Unknown",
        examWeightage: exam.ExamWeightage,
        announcedDate: exam.AnnouncedDate,
        partStatus: exam.partStatus,
        portalCategory: exam.portalCategory,
        termId: exam.Term._id,
        termName: exam.Term.sessionTerm,
        status: exam.status,
        groups,
      });
    }

    console.log(`[DEBUG] Returning ${activeExams.length} active exams with marks`);
    res.status(200).json({ activeExams });
  } catch (error) {
    console.error("[ERROR] getActiveExamsWithMarks failed:", error);
    res.status(500).json({ error: error.message || "Failed to fetch active exams" });
  }
};

const updateExaminerMarksByCoordinator = async (req, res) => {
  try {
    const { supervisorId, termId, examId, groupId, studentId, examinerId, newMarks } = req.body;

    console.log("[DEBUG] updateExaminerMarksByCoordinator called:", {
      supervisorId, termId, examId, groupId, studentId, examinerId, newMarks,
    });

    // Validate
    if (newMarks == null || isNaN(Number(newMarks)) || Number(newMarks) < 0) {
      return res.status(400).json({ error: "Invalid marks value. Must be a number >= 0." });
    }

    // Find the Evaluation document by supervisorId
    const evaluation = await Evaluation.findOne({ supervisorId });
    if (!evaluation) {
      return res.status(404).json({ error: "Evaluation document not found for this supervisor." });
    }

    // Navigate the nested structure
    const foundTerm = evaluation.terms.find(
      (t) => t.termId && t.termId.toString() === termId.toString()
    );
    if (!foundTerm) {
      return res.status(404).json({ error: "Term not found in evaluation document." });
    }

    let foundExam = foundTerm.exams.find(
      (e) => e.examId && e.examId.toString() === examId.toString()
    );
    if (!foundExam) {
      console.log("[DEBUG] Exam ID not found, trying name-based fallback...");
      // We don't have the name here, so just report not found
      return res.status(404).json({ error: "Exam not found in this term's evaluations." });
    }

    const foundGroup = foundExam.fypGroups.find(
      (g) => g.groupId && g.groupId.toString() === groupId.toString()
    );
    if (!foundGroup) {
      return res.status(404).json({ error: "Group not found in this exam." });
    }

    const foundStudent = foundGroup.students.find(
      (s) => s.studentId && s.studentId.toString() === studentId.toString()
    );
    if (!foundStudent) {
      return res.status(404).json({ error: "Student not found in this group." });
    }

    const foundExaminer = foundStudent.evaluationsByExaminers.find(
      (e) => e.examinerId && e.examinerId.toString() === examinerId.toString()
    );
    if (!foundExaminer) {
      return res.status(404).json({ error: "Examiner entry not found for this student." });
    }

    // Check if this examiner used CLO-based evaluation
    if (foundExaminer.evaluations && foundExaminer.evaluations.length > 0) {
      return res.status(400).json({
        error: "Cannot edit CLO-based marks directly. Only simple marks can be edited.",
      });
    }

    // Update the marks
    const oldMarks = foundExaminer.marks;
    foundExaminer.marks = Number(newMarks);
    console.log(`[DEBUG] Updated marks for examiner ${examinerId}: ${oldMarks} → ${newMarks}`);

    // Recalculate averages using the existing unified helper
    recalculateAverages(evaluation, termId, examId);

    // Mark nested arrays as modified for Mongoose
    evaluation.markModified("terms");
    await evaluation.save();

    console.log("[DEBUG] Evaluation document saved successfully after coordinator edit.");
    res.status(200).json({ message: "Marks updated successfully" });
  } catch (error) {
    console.error("[ERROR] updateExaminerMarksByCoordinator failed:", error);
    res.status(500).json({ error: error.message || "Failed to update marks" });
  }
};

// ============================================================================
// PANEL MEMBER: Fetch own marks for a specific exam + group
// ============================================================================

const getExaminerMarksForGroup = async (req, res) => {
  try {
    const { termId, examId, groupId, examinerId } = req.query;

    console.log("[DEBUG] getExaminerMarksForGroup called:", { termId, examId, groupId, examinerId });

    if (!termId || !examId || !groupId || !examinerId) {
      return res.status(400).json({ error: "Missing required query params: termId, examId, groupId, examinerId" });
    }

    // Fetch exam status and term info
    const exam = await CreateExam.findById(examId).populate("Term");
    let examStatus = "Active";
    let termExpired = false;

    if (exam) {
      examStatus = exam.status || "Active";
      if (exam.Term && exam.Term.endDate && new Date(exam.Term.endDate) < new Date()) {
        termExpired = true;
      }
    }

    // Find the FYP group to get supervisorId
    const groupReg = await FypRegistration.findById(groupId);
    if (!groupReg) {
      return res.status(200).json({ found: false, examStatus, termExpired, students: [] });
    }
    const supervisorId = groupReg.selectedOption;

    // Find evaluation document
    const evaluation = await Evaluation.findOne({ supervisorId });
    if (!evaluation) {
      return res.status(200).json({ found: false, examStatus, termExpired, students: [] });
    }

    const foundTerm = evaluation.terms.find(t => t.termId && t.termId.toString() === termId.toString());
    if (!foundTerm) {
      return res.status(200).json({ found: false, examStatus, termExpired, students: [] });
    }

    let foundExam = foundTerm.exams.find(e => e.examId && e.examId.toString() === examId.toString());
    // Fallback by name
    if (!foundExam && exam && exam.ExamType) {
      const examType = await ExamType.findById(exam.ExamType);
      if (examType) {
        foundExam = foundTerm.exams.find(e => e.examName === examType.examName);
      }
    }
    if (!foundExam) {
      return res.status(200).json({ found: false, examStatus, termExpired, students: [] });
    }

    const foundGroup = foundExam.fypGroups.find(g => g.groupId && g.groupId.toString() === groupId.toString());
    if (!foundGroup) {
      return res.status(200).json({ found: false, examStatus, termExpired, students: [] });
    }

    // Extract this examiner's marks for each student
    let feedback = "";
    const students = [];

    for (const student of foundGroup.students) {
      const examinerEntry = student.evaluationsByExaminers.find(
        e => e.examinerId && e.examinerId.toString() === examinerId.toString()
      );

      if (examinerEntry) {
        // Capture feedback from the first examiner entry found
        if (!feedback && examinerEntry.feedback) {
          feedback = examinerEntry.feedback;
        }

        const hasCLOData = !!(examinerEntry.evaluations && examinerEntry.evaluations.length > 0);

        // Build CLO evaluation data if available
        let cloEvaluations = [];
        if (hasCLOData) {
          cloEvaluations = examinerEntry.evaluations.map(ev => ({
            cloForExamId: ev.cloForExamId,
            cloEvaluations: ev.cloEvaluations.map(cloEval => ({
              cloId: cloEval.cloId,
              questions: cloEval.questions.map(q => ({
                questionId: q.questionId,
                marks: q.marks
              }))
            })),
            totalCLOPercentage: ev.totalCLOPercentage,
            obtainedCLOPercentage: ev.obtainedCLOPercentage
          }));
        }

        students.push({
          studentId: student.studentId,
          marks: examinerEntry.marks != null ? examinerEntry.marks : 0,
          totalWeightage: examinerEntry.totalWeightage || 0,
          hasCLOData,
          cloEvaluations
        });
      }
    }

    if (students.length === 0) {
      return res.status(200).json({ found: false, examStatus, termExpired, students: [] });
    }

    console.log(`[DEBUG] Found marks for ${students.length} students by examiner ${examinerId}`);
    return res.status(200).json({
      found: true,
      examStatus,
      termExpired,
      feedback,
      students
    });

  } catch (error) {
    console.error("[ERROR] getExaminerMarksForGroup failed:", error);
    res.status(500).json({ error: error.message || "Failed to fetch examiner marks" });
  }
};

module.exports = {
  getEvaluationMarks,
  addEvaluationMarks,
  fetchAllExamOfGroup,
  fetchTermEvaluationDetails,
  fetchExamEvaluationDetails,
  getExamEvaluationDetailsbyTerm,
  getExamEvaluationDetailsbyTermAndExam,
  fetchStudentMarksByTermAndExamName,
  addOrientationMarks,
  getActiveExamsWithMarks,
  updateExaminerMarksByCoordinator,
  getExaminerMarksForGroup
};
