const mongoose = require("mongoose");
const FypRegistration = require("../models/StudentModels/fypRegModel");
const GenUser = require("../models/AdminModels/GenUserModel");
const Evaluation = require("../models/CoordinatorModels/EvaluateExamModel");
const PassFailCriteria = require("../models/CoordinatorModels/PassFailCriteriaModel");
const CreateExamModel = require("../models/CoordinatorModels/ExamCreationModel");
const ExamTypeModel = require("../models/CoordinatorModels/ExamTypeModel");

const runSelfHealingCleanup = async () => {
    try {
        console.log("🚀 Running self-healing database cleanup for promoted groups...");

        // 1. Fetch all groups currently in Part-II
        const partIIGroups = await FypRegistration.find({ partStatus: "part-II", reqStatus: "approved" });
        if (partIIGroups.length === 0) {
            console.log("ℹ️ No Part-II groups found. No cleanup needed.");
            return;
        }

        console.log(`🔍 Found ${partIIGroups.length} Part-II group(s) to verify.`);

        for (const group of partIIGroups) {
            const termId = group.term ? (group.term._id || group.term).toString() : null;
            if (!termId) continue;

            // Fetch passing criteria for this group's term
            const criteriaRecord = await PassFailCriteria.findOne({ term: termId });
            const passingCriteria = criteriaRecord ? criteriaRecord.passingCriteria : 50;

            // Fetch all evaluations for this term
            const evals = await Evaluation.find({ "terms.termId": termId });

            // Calculate accumulated Part-I marks for students in this term
            const studentMarksMap = {};
            for (const doc of evals) {
                const t = doc.terms.find(termEntry => termEntry.termId.toString() === termId);
                if (t && t.exams) {
                    for (const exam of t.exams) {
                        const examDetails = await CreateExamModel.findById(exam.examId);
                        const examType = examDetails ? await ExamTypeModel.findById(examDetails.ExamType) : null;
                        const dbPartStatus = examDetails?.partStatus;
                        const examTypeFor = examType?.examTypeFor;
                        const examName = (examType?.examName || exam.examName || "").toLowerCase();

                        let isPartI = false;
                        if (dbPartStatus === 'Part-I' || examTypeFor === 'part-I' || examTypeFor === 'part-i') {
                            isPartI = true;
                        } else if (!dbPartStatus && !examTypeFor) {
                            isPartI = examName.includes('proposal') || 
                                      (examName.includes('attendance') && !examName.includes('ii')) || 
                                      (examName.includes('mid') && !examName.includes('ii')) || 
                                      (examName.includes('final') && !examName.includes('ii'));
                        }

                        if (isPartI) {
                            exam.fypGroups.forEach(g => {
                                g.students.forEach(student => {
                                    const sId = student.studentId?._id ? student.studentId._id.toString() : student.studentId?.toString();
                                    if (sId) {
                                        if (!studentMarksMap[sId]) {
                                            studentMarksMap[sId] = 0;
                                        }
                                        studentMarksMap[sId] += (student.obtainedAverage || 0);
                                    }
                                });
                            });
                        }
                    }
                }
            }

            // Verify each member inside groupMembers array
            const passingMembers = [];
            let groupChanged = false;

            for (const member of group.groupMembers) {
                const studentIdStr = member._id.toString();
                const studentUser = await GenUser.findById(member._id);

                if (!studentUser) {
                    // Student user not found, remove from group members list
                    groupChanged = true;
                    console.log(`⚠️ Removed non-existent student ${member.name} (${member.registrationNumber}) from group ${group.topicData?.topic}`);
                    continue;
                }

                const totalMarks = Math.round((studentMarksMap[studentIdStr] || 0) * 100) / 100;

                if (totalMarks >= passingCriteria) {
                    // STUDENT PASSED
                    passingMembers.push(member);
                    if (studentUser.partStatus !== "part-II") {
                        studentUser.partStatus = "part-II";
                        await studentUser.save();
                        console.log(`✅ Promoted student ${studentUser.name} (${studentUser.registrationNumber}) user profile to Part-II.`);
                    }
                } else {
                    // STUDENT FAILED (Aisha Khan falls here)
                    groupChanged = true;
                    studentUser.partStatus = "failed-part-I";
                    studentUser.term = null;
                    await studentUser.save();

                    console.log(`🛑 Unregistered failed student ${studentUser.name} (${studentUser.registrationNumber}) - Marks: ${totalMarks}/${passingCriteria}%`);
                }
            }

            if (groupChanged) {
                if (passingMembers.length === 0) {
                    group.partStatus = "failed-part-I";
                    group.groupMembers = [];
                    await group.save();
                    console.log(`❌ Deactivated group ${group.topicData?.topic} because all members failed.`);
                } else {
                    group.groupMembers = passingMembers;
                    await group.save();
                    console.log(`🛡️ Updated group ${group.topicData?.topic} members list. Remaining passing members count: ${passingMembers.length}`);
                }
            }
        }

        console.log("🏁 Self-healing database cleanup complete!");
    } catch (error) {
        console.error("❌ Error in self-healing database cleanup:", error);
    }
};

module.exports = { runSelfHealingCleanup };
