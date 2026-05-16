const fs = require('fs');

const filePath = 'd:\\FYP\\FYP PORTAL CODE\\BE-BackUpBeforeWholeIntegration\\BE-BackUpBeforeWholeIntegration\\server\\controllers\\CoordinatorController\\EvaluateExamCont.js';
let content = fs.readFileSync(filePath, 'utf8');

// I will find the start and end of the relevant section and replace it entirely.
// Start: const addEvaluationMarks
// End: before calculationAverageCLOPercentage or after storeMarksForOrientation

// I'll use a more surgical approach by replacing each function entirely using regex to find their boundaries.

const newAddEvaluationMarks = `const addEvaluationMarks = async (req, res) => {
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
    console.log(panelId, "BODY CONSOLED in add evaluation");
    let examName;
    let examTypeFor;

    if (!mongoose.Types.ObjectId.isValid(termId)) {
      return res.status(400).json({ error: "Invalid termId format" });
    }

    // Check if the exam has CLOs based on examId
    const exam = await CreateExam.findById(examId).populate(
      "ExamType CLOForExams"
    );
    console.log(exam, "exam Consoled");
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }
    examName = exam.ExamType.examName;
    examTypeFor = exam.ExamType.examTypeFor;

    let containsCLO = false;
    if (exam.CLOForExams) {
      const CLOForExams = await CLOForExam.findById(exam.CLOForExams).populate(
        "CLOs"
      );
      if (CLOForExams && CLOForExams.CLOs.length > 0) {
        containsCLO = true;
      }
    }

    // Fetch the supervisorId from FypRegistration
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
      const specificTerm = termEvaluation.terms.find(
        (t) => t.termId.toString() === termId.toString()
      );
      if (specificTerm) {
        const examEvaluation = specificTerm.exams.find(
          (e) => e.examId.toString() === examId.toString()
        );
        if (examEvaluation) {
          const groupEvaluation = examEvaluation.fypGroups.find(
            (g) => g.groupId.toString() === groupId.toString()
          );
          if (groupEvaluation) {
            const studentEvaluation = groupEvaluation.students.find((student) =>
              student.evaluationsByExaminers.some(
                (e) => e.examinerId.toString() === examinerId.toString()
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
    }

    let evaluation;
    if (containsCLO) {
      evaluation = await handleEvaluationWithCLOs(
        groupId,
        termId,
        examId,
        examName,
        examTypeFor,
        examinerId,
        evaluations,
        exam.ExamWeightage,
        feedback,
        panelId,
        supervisorId
      );
    } else {
      const examType = exam ? await getExamTypeName(exam.ExamType) : "";
      evaluation = await handleEvaluationWithoutCLOs(
        groupId,
        termId,
        examId,
        examName,
        examTypeFor,
        examinerId,
        evaluations,
        examType,
        exam.ExamWeightage,
        supervisorId
      );
    }

    res.status(200).json({
      message: "Marks added successfully",
      evaluation,
    });
  } catch (error) {
    console.error("Error adding marks:", error);
    res.status(500).json({ error: "Failed to add marks: " + error.message });
  }
};`;

const newHandleEvaluationWithCLOs = `const handleEvaluationWithCLOs = async (
  groupId,
  termId,
  examId,
  examName,
  examTypeFor,
  examinerId,
  evaluations,
  examWeightage,
  feedback,
  panelId,
  supervisorId
) => {
  try {
    console.log("panelIDofP", panelId);
    let term = await Evaluation.findOne({ supervisorId });

    if (!term) {
      term = new Evaluation({
        supervisorId: supervisorId,
        terms: [
          {
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
          },
        ],
      });
    } else {
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
          } else {
            await Promise.all(
              evaluations.map(async (student) => {
                let studentDoc = group.students.find(
                  (s) => s.studentId.toString() === student.studentId.toString()
                );

                if (!studentDoc) {
                  group.students.push({
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
                  });
                } else {
                  const examinerEval = studentDoc.evaluationsByExaminers.find(
                    (e) => e.examinerId.toString() === examinerId.toString()
                  );
                  if (!examinerEval) {
                    studentDoc.evaluationsByExaminers.push({
                      examinerId,
                      evaluations: student.evaluations
                        ? await calculateEvaluations(
                          student.evaluations,
                          examWeightage
                        )
                        : [],
                      marks: student.marks || 0,
                      feedback: feedback || "",
                    });
                  }
                }
              })
            );
          }
        }
      }
    }

    // Calculate obtainedAverage and obtainedAverageofCLO for each student
    term.terms?.forEach((t) => {
      t.exams?.forEach((exam) => {
        if (
          exam &&
          exam.examName !== "Attendance-I" &&
          exam.examName !== "Attendance-II" &&
          exam.examName !== "Orientation"
        ) {
          exam.fypGroups?.forEach((group) => {
            group.students?.forEach((student) => {
              const totalMarks = student.evaluationsByExaminers?.reduce(
                (sum, examinerEval) => {
                  const obtainedPercentageSum = examinerEval.evaluations?.reduce(
                    (cloSum, cloEval) => {
                      return cloSum + (cloEval.obtainedCLOPercentage || 0);
                    },
                    0
                  ) || 0;
                  return sum + obtainedPercentageSum;
                },
                0
              ) || 0;

              const examinerCount = student.evaluationsByExaminers?.length || 1;
              student.obtainedAverage = totalMarks / examinerCount;

              // Calculate obtainedAverageofCLO for the student
              const averageCLOs = calculateAverageCLOPercentage(student);
              student.obtainedAverageofCLO = averageCLOs;
            });
          });
        }
      });
    });

    console.log("handleEval with CLO func executed");

    // Update the evaluationStatus in PanelDetails
    await PanelDetails.updateOne(
      { "PanelMembers.member": examinerId },
      { $set: { "PanelMembers.$.evaluationStatus": "marked" } }
    );

    await term.save();
    return term;
  } catch (error) {
    console.error("Error handling evaluation with CLOs:", error);
    throw error;
  }
};`;

const newStoreMarksForAttendance = `const storeMarksForAttendance = async (
  groupId,
  termId,
  examId,
  examName,
  examTypeFor,
  evaluations,
  examinerId,
  examWeightage,
  supervisorId
) => {
  try {
    const marks = evaluations.map((evaluation) => ({
      studentId: evaluation.studentId,
      marks: evaluation.marks,
    }));

    let term = await Evaluation.findOne({ supervisorId });

    if (!term) {
      term = new Evaluation({
        supervisorId,
        terms: [
          {
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
          },
        ],
      });
    } else {
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
          } else {
            marks.forEach((mark) => {
              let studentDoc = group.students.find(
                (s) => s.studentId.toString() === mark.studentId.toString()
              );
              if (!studentDoc) {
                studentDoc = {
                  studentId: mark.studentId,
                  evaluationsByExaminers: [
                    {
                      examinerId,
                      marks: mark.marks,
                      totalWeightage: examWeightage,
                    },
                  ],
                };
                group.students.push(studentDoc);
              } else {
                let examinerEval = studentDoc.evaluationsByExaminers.find(
                  (e) => e.examinerId.toString() === examinerId.toString()
                );
                if (!examinerEval) {
                  studentDoc.evaluationsByExaminers.push({
                    examinerId,
                    marks: mark.marks,
                    totalWeightage: examWeightage,
                  });
                } else {
                  examinerEval.marks = mark.marks;
                }
              }
            });
          }
        }
      }
    }

    // Calculate obtained average for the current exam
    const foundTerm = term.terms.find(t => t.termId.toString() === termId.toString());
    const currentExam = foundTerm?.exams.find((e) => e.examId.toString() === examId.toString());
    currentExam?.fypGroups?.forEach((group) => {
      group.students?.forEach((student) => {
        const totalMarks = student.evaluationsByExaminers?.reduce(
          (sum, examinerEval) => sum + (examinerEval.marks || 0),
          0
        );
        student.obtainedAverage =
          totalMarks / (student.evaluationsByExaminers?.length || 1);
      });
    });

    await term.save();
    return term;
  } catch (error) {
    console.error("Error storing marks for Attendance:", error);
    throw error;
  }
};`;

const newStoreMarksForOrientation = `const storeMarksForOrientation = async (
  groupId,
  termId,
  examId,
  examName,
  examTypeFor,
  evaluations,
  examinerId,
  examWeightage,
  supervisorId
) => {
  try {
    const marks = evaluations.map((evaluation) => ({
      studentId: evaluation.studentId,
      marks: evaluation.marks,
    }));

    let term = await Evaluation.findOne({ supervisorId });

    if (!term) {
      term = new Evaluation({
        supervisorId,
        terms: [
          {
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
          },
        ],
      });
    } else {
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
          } else {
            marks.forEach((mark) => {
              const studentDoc = group.students.find(
                (s) => s.studentId.toString() === mark.studentId.toString()
              );
              if (!studentDoc) {
                group.students.push({
                  studentId: mark.studentId,
                  evaluationsByExaminers: [
                    {
                      examinerId,
                      marks: mark.marks,
                      totalWeightage: examWeightage,
                    },
                  ],
                });
              } else {
                const examinerEval = studentDoc.evaluationsByExaminers.find(
                  (e) => e.examinerId.toString() === examinerId.toString()
                );
                if (!examinerEval) {
                  studentDoc.evaluationsByExaminers.push({
                    examinerId,
                    marks: mark.marks,
                    totalWeightage: examWeightage,
                  });
                } else {
                  examinerEval.marks = mark.marks;
                }
              }
            });
          }
        }
      }
    }

    await term.save();
    return term;
  } catch (error) {
    console.error("Error storing marks for Orientation:", error);
    throw error;
  }
};`;

// Replace functions in content
// We use a regex that matches the function from its start to the end of its block.
// This is slightly risky but I'll use enough anchor text.

function replaceFunc(content, funcName, newImpl) {
    const regex = new RegExp(`const ${funcName} = async \\([\\s\\S]+?\\n};`, 'g');
    return content.replace(regex, newImpl);
}

// Special case for addEvaluationMarks which is not defined with 'const' but 'const' in some versions
content = content.replace(/const addEvaluationMarks = async \(req, res\) => \{[\s\S]+?\n\};/, newAddEvaluationMarks);
content = content.replace(/const handleEvaluationWithCLOs = async \([\s\S]+?\n\};/, newHandleEvaluationWithCLOs);
content = content.replace(/const storeMarksForAttendance = async \([\s\S]+?\n\};/, newStoreMarksForAttendance);
content = content.replace(/const storeMarksForOrientation = async \([\s\S]+?\n\};/, newStoreMarksForOrientation);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Mega Fix applied.');
