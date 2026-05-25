const FypRegistration = require("../../models/StudentModels/fypRegModel");
const FYPTerm = require("../../models/AdminModels/fypTerm");
const mongoose = require("mongoose");

/**
 * Promote all approved FYP groups from Part I to Part II
 * This UPDATES the existing group documents in-place (no duplication).
 * The group keeps the same _id, so all exam marks, attendance, reports,
 * and every other reference tied to the group remain intact.
 * Route: POST /api/CreateFypReg/promote-to-part-ii
 */
const promoteGroupsToPartII = async (req, res) => {
    try {
        const { termId } = req.body;

        // 1. Validate term ID
        if (!mongoose.Types.ObjectId.isValid(termId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid term ID format'
            });
        }

        // Fetch term to validate
        const term = await FYPTerm.findById(termId);

        if (!term) {
            return res.status(404).json({
                success: false,
                error: 'Term not found'
            });
        }

        // Check if groups have already been promoted to Part II in this term
        const existingPromotions = await FypRegistration.countDocuments({
            term: termId,
            partStatus: 'part-II'
        });

        if (existingPromotions > 0) {
            return res.status(400).json({
                success: false,
                error: `${existingPromotions} groups have already been promoted to Part II in this term. Promotion can only be done once.`,
                alreadyPromoted: existingPromotions
            });
        }

        // 2. Fetch Passing Criteria (defaults to 50)
        const PassFailCriteria = require("../../models/CoordinatorModels/PassFailCriteriaModel");
        const criteriaRecord = await PassFailCriteria.findOne({ term: termId });
        const passingCriteria = criteriaRecord ? criteriaRecord.passingCriteria : 50;

        // 3. Fetch all Evaluations for Part-I exams in this term
        const Evaluation = require("../../models/CoordinatorModels/EvaluateExamModel");
        const evaluationDocs = await Evaluation.find({ "terms.termId": termId })
            .populate({
                path: 'terms.exams.examId',
                select: 'ExamWeightage ExamType partStatus portalCategory',
                populate: { path: 'ExamType', select: 'examName examTypeFor' }
            });

        // 4. Calculate accumulated Part-I marks for all students
        const studentMarksMap = {};
        evaluationDocs.forEach(doc => {
            const t = doc.terms.find(termEntry => termEntry.termId.toString() === termId);
            if (t && t.exams) {
                t.exams.forEach(exam => {
                    const dbPartStatus = exam.examId?.partStatus;
                    const examTypeFor = exam.examId?.ExamType?.examTypeFor;
                    const examName = (exam.examId?.ExamType?.examName || exam.examName || "").toLowerCase();

                    // Check if it is a Part-I exam
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
                        exam.fypGroups.forEach(group => {
                            group.students.forEach(student => {
                                const studentId = student.studentId?._id ? student.studentId._id.toString() : student.studentId?.toString();
                                if (!studentId) return;

                                if (!studentMarksMap[studentId]) {
                                    studentMarksMap[studentId] = 0;
                                }
                                studentMarksMap[studentId] += (student.obtainedAverage || 0);
                            });
                        });
                    }
                });
            }
        });

        // 5. Fetch all approved Part I groups
        const partIGroups = await FypRegistration.find({
            term: termId,
            partStatus: 'part-I',
            reqStatus: 'approved'
        });

        if (partIGroups.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No approved Part I groups found in this term'
            });
        }

        const GenUser = require("../../models/AdminModels/GenUserModel");
        const promotedGroups = [];
        const unregisteredStudents = [];

        // 6. Process each group individually
        for (const group of partIGroups) {
            let hasPassingMember = false;

            for (const member of group.groupMembers) {
                const studentIdStr = member._id.toString();
                const totalMarks = Math.round((studentMarksMap[studentIdStr] || 0) * 100) / 100;

                if (totalMarks >= passingCriteria) {
                    // STUDENT PASSED: Keep active in group, update status to part-II
                    member.memberStatus = 'active';
                    hasPassingMember = true;
                    await GenUser.findByIdAndUpdate(member._id, { $set: { partStatus: 'part-II' } });
                } else {
                    // STUDENT FAILED: Set memberStatus to failed-part-I, unregister them from active term
                    member.memberStatus = 'failed-part-I';
                    unregisteredStudents.push({
                        studentId: studentIdStr,
                        name: member.name,
                        registrationNumber: member.registrationNumber,
                        marks: totalMarks,
                        groupId: group._id
                    });
                    
                    await GenUser.findByIdAndUpdate(member._id, { 
                        $set: { 
                            partStatus: 'failed-part-I',
                            term: null 
                        } 
                    });
                }
            }

            // 7. Update Group Status (retaining all members in the list for history)
            if (!hasPassingMember) {
                // ALL MEMBERS FAILED: Set group status to failed-part-I
                group.partStatus = 'failed-part-I';
            } else {
                // SOME or ALL MEMBERS PASSED: Set group status to part-II
                group.partStatus = 'part-II';
                promotedGroups.push(group);
            }
            group.markModified("groupMembers");
            await group.save();
        }

        console.log(`✓ Successfully completed promotion. Promoted ${promotedGroups.length} groups. Unregistered ${unregisteredStudents.length} failed students.`);

        res.status(200).json({
            success: true,
            message: `Promotion phase complete. Promoted ${promotedGroups.length} groups to Part II. Unregistered ${unregisteredStudents.length} failed students.`,
            term: term.sessionTerm,
            passingCriteria,
            promotedCount: promotedGroups.length,
            unregisteredCount: unregisteredStudents.length,
            promotedGroups: promotedGroups.map(g => ({
                id: g._id,
                supervisor: g.selectedOption,
                topic: g.topicData.topic,
                memberCount: g.groupMembers.length
            })),
            unregisteredStudents
        });

    } catch (error) {
        console.error('Error promoting groups to Part II:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};

/**
 * Check if the current term is eligible for promotion to Part II
 * Route: GET /api/CreateFypReg/check-promotion-eligibility/:termId
 */
const checkPromotionEligibility = async (req, res) => {
    try {
        const { termId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(termId)) {
            return res.status(400).json({ success: false, error: 'Invalid term ID format' });
        }

        // Check if ANY group has already been promoted
        const existingPromotions = await FypRegistration.countDocuments({
            term: termId,
            partStatus: 'part-II'
        });

        if (existingPromotions > 0) {
            return res.status(200).json({ 
                success: true, 
                eligible: false, 
                message: 'Promotion has already occurred for this term.' 
            });
        }

        // Check if there are part-I groups
        const partIGroups = await FypRegistration.countDocuments({
            term: termId,
            partStatus: 'part-I',
            reqStatus: 'approved'
        });

        if (partIGroups === 0) {
            return res.status(200).json({ 
                success: true, 
                eligible: false, 
                message: 'No approved Part I groups found in this term.' 
            });
        }

        // Check evaluating status for all exams
        const Evaluation = require("../../models/CoordinatorModels/EvaluateExamModel");
        
        // Find all evaluations for this term, populating the exam details to get weights
        const termEvals = await Evaluation.find({ "terms.termId": termId })
            .populate({
                path: 'terms.exams.examId',
                select: 'ExamWeightage partStatus'
            });
        
        let part1Weight = 0;
        let markedExams = new Set();
        
        termEvals.forEach(evalRecord => {
            evalRecord.terms.forEach(t => {
                if (t.termId.toString() === termId) {
                    t.exams.forEach(e => {
                        const examIdStr = e.examId?._id?.toString();
                        // Make sure we only count each exam's weight once (multiple supervisors might evaluate the same exam)
                        if (examIdStr && !markedExams.has(examIdStr)) {
                            markedExams.add(examIdStr);
                            if (e.examId.partStatus === 'Part-I' || e.examId.partStatus === 'part-I') {
                                part1Weight += (e.examId.ExamWeightage || 0);
                            }
                        }
                    });
                }
            });
        });
        
        if (part1Weight < 100) {
             return res.status(200).json({ 
                success: true,
                eligible: false, 
                message: `Not all required exams are marked. Current Part-I weight is ${part1Weight}% (needs 100%).`,
                missing: [`Needs ${100 - part1Weight}% more weight`]
             });
        }

        res.status(200).json({ 
            success: true,
            eligible: true,
            message: 'All exams are marked. Term is eligible for promotion.'
        });

    } catch (error) {
        console.error('Error checking promotion eligibility:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};

module.exports = {
    promoteGroupsToPartII,
    checkPromotionEligibility
};
