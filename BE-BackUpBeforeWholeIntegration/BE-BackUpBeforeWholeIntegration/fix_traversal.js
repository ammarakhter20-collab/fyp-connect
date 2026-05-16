const fs = require('fs');

const filePath = 'd:\\FYP\\FYP PORTAL CODE\\BE-BackUpBeforeWholeIntegration\\BE-BackUpBeforeWholeIntegration\\server\\controllers\\CoordinatorController\\EvaluateExamCont.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix addEvaluationMarks 'Already marked' check
const alreadyMarkedOld = `    // Check if examinerId already exists in the document
    const termEvaluation = await Evaluation.findOne({
      termId,
      "exams.examId": examId,
    });
    if (termEvaluation) {
      const examEvaluation = termEvaluation.exams.find(
        (e) => e.examId.toString() === examId
      );
      if (examEvaluation) {
        const groupEvaluation = examEvaluation.fypGroups.find(
          (g) => g.groupId.toString() === groupId
        );
        if (groupEvaluation) {
          const studentEvaluation = groupEvaluation.students.find((student) =>
            student.evaluationsByExaminers.some(
              (e) => e.examinerId.toString() === examinerId
            )
          );
          if (studentEvaluation) {
            return res.status(400).json({
              error: "Already marked by this examiner",
              message: "Already Marked",
            });
          }
        }
      }
    }

    // Fetch the supervisorId from FypRegistration
    const groupRegistration = await FypRegistration.findById(groupId);
    if (!groupRegistration) {
      return res.status(404).json({ error: "FYP Group registration not found" });
    }
    const supervisorId = groupRegistration.selectedOption;`;

const alreadyMarkedNew = `    // Fetch the supervisorId from FypRegistration (Moved up)
    const groupRegistration = await FypRegistration.findById(groupId);
    if (!groupRegistration) {
      return res.status(404).json({ error: "FYP Group registration not found" });
    }
    const supervisorId = groupRegistration.selectedOption;

    // Check if examinerId already exists in the document
    const termEvaluation = await Evaluation.findOne({
      supervisorId,
      "terms.termId": termId,
      "terms.exams.examId": examId,
    });
    if (termEvaluation) {
      const specificTerm = termEvaluation.terms.find((t) => t.termId.toString() === termId);
      if (specificTerm) {
        const examEvaluation = specificTerm.exams.find(
          (e) => e.examId.toString() === examId
        );
        if (examEvaluation) {
          const groupEvaluation = examEvaluation.fypGroups.find(
            (g) => g.groupId.toString() === groupId
          );
          if (groupEvaluation) {
            const studentEvaluation = groupEvaluation.students.find((student) =>
              student.evaluationsByExaminers.some(
                (e) => e.examinerId.toString() === examinerId
              )
            );
            if (studentEvaluation) {
              return res.status(400).json({
                error: "Already marked by this examiner",
                message: "Already Marked",
              });
            }
          }
        }
      }
    }`;

content = content.replace(alreadyMarkedOld, alreadyMarkedNew);

// 2. Fix handleEvaluationWithCLOs 'else' block and 'Calculate obtainedAverage'
const cloElseOld = `    } else {
      const exam = term.exams.find((e) => e.examId.toString() === examId);
      if (!exam) {
        term.exams.push({
          examId,
          examName,
          examTypeFor,
          fypGroups: [
            {
              groupId,
              panelId,
              students: await Promise.all(
                evaluations.map(async (student) => ({
                  studentId: student.studentId,
                  evaluationsByExaminers: [
                    {
                      examinerId,
                      evaluations: student.evaluations
                        ? await calculateEvaluations(
                          student.evaluations,
                          examWeightage
                        )
                        : [],
                      marks: student.marks || 0,
                      feedback: feedback || "",
                    },
                  ],
                  obtainedAverage: 0,
                  obtainedAverageofCLO: [],
                }))
              ),
            },
          ],
        });
      } else {
        const group = exam.fypGroups.find(
          (g) => g.groupId.toString() === groupId
        );
        if (!group) {
          exam.fypGroups.push({
            groupId,
            panelId,
            students: await Promise.all(
              evaluations.map(async (student) => ({
                studentId: student.studentId,
                evaluationsByExaminers: [
                  {
                    examinerId,
                    evaluations: student.evaluations
                      ? await calculateEvaluations(
                        student.evaluations,
                        examWeightage
                      )
                      : [],
                    marks: student.marks || 0,
                    feedback: feedback || "",
                  },
                ],
                obtainedAverage: 0,
                obtainedAverageofCLO: [],
              }))
            ),
          });
        } else {`;

const cloElseNew = `    } else {
      let specificTerm = term.terms.find((t) => t.termId.toString() === termId.toString());
      if (!specificTerm) {
        specificTerm = {
          termId,
          exams: [
            {
              examId,
              examName,
              examTypeFor,
              fypGroups: [
                {
                  groupId,
                  panelId,
                  students: await Promise.all(
                    evaluations.map(async (student) => ({
                      studentId: student.studentId,
                      evaluationsByExaminers: [
                        {
                          examinerId,
                          evaluations: student.evaluations
                            ? await calculateEvaluations(
                              student.evaluations,
                              examWeightage
                            )
                            : [],
                          marks: student.marks || 0,
                          feedback: feedback || "",
                        },
                      ],
                      obtainedAverage: 0,
                      obtainedAverageofCLO: [],
                    }))
                  ),
                },
              ],
            },
          ],
        };
        term.terms.push(specificTerm);
      } else {
        const exam = specificTerm.exams.find((e) => e.examId.toString() === examId.toString());
        if (!exam) {
          specificTerm.exams.push({
            examId,
            examName,
            examTypeFor,
            fypGroups: [
              {
                groupId,
                panelId,
                students: await Promise.all(
                  evaluations.map(async (student) => ({
                    studentId: student.studentId,
                    evaluationsByExaminers: [
                      {
                        examinerId,
                        evaluations: student.evaluations
                          ? await calculateEvaluations(
                            student.evaluations,
                            examWeightage
                          )
                          : [],
                        marks: student.marks || 0,
                        feedback: feedback || "",
                      },
                    ],
                    obtainedAverage: 0,
                    obtainedAverageofCLO: [],
                  }))
                ),
              },
            ],
          });
        } else {
          const group = exam.fypGroups.find(
            (g) => g.groupId.toString() === groupId.toString()
          );
          if (!group) {
            exam.fypGroups.push({
              groupId,
              panelId,
              students: await Promise.all(
                evaluations.map(async (student) => ({
                  studentId: student.studentId,
                  evaluationsByExaminers: [
                    {
                      examinerId,
                      evaluations: student.evaluations
                        ? await calculateEvaluations(
                          student.evaluations,
                          examWeightage
                        )
                        : [],
                      marks: student.marks || 0,
                      feedback: feedback || "",
                    },
                  ],
                  obtainedAverage: 0,
                  obtainedAverageofCLO: [],
                }))
              ),
            });
          } else {`;

content = content.replace(cloElseOld, cloElseNew);

const cloAverageOld = `    // Calculate obtainedAverage and obtainedAverageofCLO for each student
    term.exams?.forEach((exam) => {
      if (
        exam &&
        exam.examName !== "Attendance-I" &&
        exam.examName !== "Attendance-II" &&
        exam.examName !== "Orientation"
      ) {
        exam.fypGroups?.forEach((group) => {`;

const cloAverageNew = `    // Calculate obtainedAverage and obtainedAverageofCLO for each student
    term.terms?.forEach((t) => {
      t.exams?.forEach((exam) => {
        if (
          exam &&
          exam.examName !== "Attendance-I" &&
          exam.examName !== "Attendance-II" &&
          exam.examName !== "Orientation"
        ) {
          exam.fypGroups?.forEach((group) => {`;

content = content.replace(cloAverageOld, cloAverageNew);

// Add missing closing brace for terms loop in handleEvaluationWithCLOs
// This is tricky, I need to find where the loop ends.
// In the current file, it seems the last cloAverageOld replacement will need extra closing braces.
// Let's fix that in a more specific way.
content = content.replace(`            student.obtainedAverageofCLO = averageCLOs;
          });
        });
      }
    });`, `            student.obtainedAverageofCLO = averageCLOs;
          });
        });
      }
    });
  });`);

// 3. Fix storeMarksForAttendance
const attElseOld = `    } else {
      let exam = term.exams.find((e) => e.examId.toString() === examId);
      if (!exam) {
        exam = {
          examId,
          examName,
          examTypeFor,
          fypGroups: [
            {
              groupId,
              students: marks.map((mark) => ({
                studentId: mark.studentId,
                evaluationsByExaminers: [
                  {
                    examinerId,
                    marks: mark.marks,
                    totalWeightage: examWeightage,
                  },
                ],
              })),
            },
          ],
        };
        term.exams.push(exam);
      } else {
        let group = exam.fypGroups.find(
          (g) => g.groupId.toString() === groupId
        );
        if (!group) {
          group = {
            groupId,
            students: marks.map((mark) => ({
              studentId: mark.studentId,
              evaluationsByExaminers: [
                {
                  examinerId,
                  marks: mark.marks,
                  totalWeightage: examWeightage,
                },
              ],
            })),
          };
          exam.fypGroups.push(group);
        } else {`;

const attElseNew = `    } else {
      let specificTerm = term.terms.find((t) => t.termId.toString() === termId.toString());
      if (!specificTerm) {
        specificTerm = {
          termId,
          exams: [
            {
              examId,
              examName,
              examTypeFor,
              fypGroups: [
                {
                  groupId,
                  students: marks.map((mark) => ({
                    studentId: mark.studentId,
                    evaluationsByExaminers: [
                      {
                        examinerId,
                        marks: mark.marks,
                        totalWeightage: examWeightage,
                      },
                    ],
                  })),
                },
              ],
            },
          ],
        };
        term.terms.push(specificTerm);
      } else {
        let exam = specificTerm.exams.find((e) => e.examId.toString() === examId.toString());
        if (!exam) {
          exam = {
            examId,
            examName,
            examTypeFor,
            fypGroups: [
              {
                groupId,
                students: marks.map((mark) => ({
                  studentId: mark.studentId,
                  evaluationsByExaminers: [
                    {
                      examinerId,
                      marks: mark.marks,
                      totalWeightage: examWeightage,
                    },
                  ],
                })),
              },
            ],
          };
          specificTerm.exams.push(exam);
        } else {
          let group = exam.fypGroups.find(
            (g) => g.groupId.toString() === groupId.toString()
          );
          if (!group) {
            group = {
              groupId,
              students: marks.map((mark) => ({
                studentId: mark.studentId,
                evaluationsByExaminers: [
                  {
                    examinerId,
                    marks: mark.marks,
                    totalWeightage: examWeightage,
                  },
                ],
              })),
            };
            exam.fypGroups.push(group);
          } else {`;

content = content.replace(attElseOld, attElseNew);

const attAverageOld = `    // Calculate obtained average for the current exam
    const currentExam = term.exams.find((e) => e.examId.toString() === examId);
    currentExam.fypGroups.forEach((group) => {`;

const attAverageNew = `    // Calculate obtained average for the current exam
    const foundTerm = term.terms.find(t => t.termId.toString() === termId.toString());
    const currentExam = foundTerm?.exams.find((e) => e.examId.toString() === examId.toString());
    currentExam?.fypGroups?.forEach((group) => {`;

content = content.replace(attAverageOld, attAverageNew);

// 4. Fix storeMarksForOrientation
const oriElseOld = `    } else {
      const exam = term.exams.find((e) => e.examId.toString() === examId);
      if (!exam) {
        term.exams.push({
          examId,
          examName,
          examTypeFor,
          fypGroups: [
            {
              groupId,
              students: marks.map((mark) => ({
                studentId: mark.studentId,
                evaluationsByExaminers: [
                  {
                    examinerId,
                    marks: mark.marks,
                    totalWeightage: examWeightage,
                  },
                ],
              })),
            },
          ],
        });
      } else {
        const group = exam.fypGroups.find(
          (g) => g.groupId.toString() === groupId
        );
        if (!group) {
          exam.fypGroups.push({
            groupId,
            students: marks.map((mark) => ({
              studentId: mark.studentId,
              evaluationsByExaminers: [
                {
                  examinerId,
                  marks: mark.marks,
                  totalWeightage: examWeightage,
                },
              ],
            })),
          });
        } else {`;

const oriElseNew = `    } else {
      let specificTerm = term.terms.find((t) => t.termId.toString() === termId.toString());
      if (!specificTerm) {
        specificTerm = {
          termId,
          exams: [
            {
              examId,
              examName,
              examTypeFor,
              fypGroups: [
                {
                  groupId,
                  students: marks.map((mark) => ({
                    studentId: mark.studentId,
                    evaluationsByExaminers: [
                      {
                        examinerId,
                        marks: mark.marks,
                        totalWeightage: examWeightage,
                      },
                    ],
                  })),
                },
              ],
            },
          ],
        };
        term.terms.push(specificTerm);
      } else {
        const exam = specificTerm.exams.find((e) => e.examId.toString() === examId.toString());
        if (!exam) {
          specificTerm.exams.push({
            examId,
            examName,
            examTypeFor,
            fypGroups: [
              {
                groupId,
                students: marks.map((mark) => ({
                  studentId: mark.studentId,
                  evaluationsByExaminers: [
                    {
                      examinerId,
                      marks: mark.marks,
                      totalWeightage: examWeightage,
                    },
                  ],
                })),
              },
            ],
          });
        } else {
          const group = exam.fypGroups.find(
            (g) => g.groupId.toString() === groupId.toString()
          );
          if (!group) {
            exam.fypGroups.push({
              groupId,
              students: marks.map((mark) => ({
                studentId: mark.studentId,
                evaluationsByExaminers: [
                  {
                    examinerId,
                    marks: mark.marks,
                    totalWeightage: examWeightage,
                  },
                ],
              })),
            });
          } else {`;

content = content.replace(oriElseOld, oriElseNew);

fs.writeFileSync(filePath, content, 'utf8');
console.log('File updated successfully.');
