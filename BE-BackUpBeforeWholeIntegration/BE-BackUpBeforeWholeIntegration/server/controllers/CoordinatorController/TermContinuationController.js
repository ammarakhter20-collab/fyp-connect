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

        // Validate term ID
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

        // Fetch all approved groups from Part I (current term, part-I)
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

        // UPDATE existing documents in-place: just change partStatus from part-I to part-II
        const updateResult = await FypRegistration.updateMany(
            {
                term: termId,
                partStatus: 'part-I',
                reqStatus: 'approved'
            },
            {
                $set: { partStatus: 'part-II' }
            }
        );

        console.log(`✓ Successfully promoted ${updateResult.modifiedCount} groups in term ${term.sessionTerm} to Part II (in-place update, no duplication)`);

        res.status(200).json({
            success: true,
            message: `Successfully promoted ${updateResult.modifiedCount} groups to Part II`,
            promotedCount: updateResult.modifiedCount,
            term: term.sessionTerm,
            promotedGroups: partIGroups.map(g => ({
                id: g._id,
                supervisor: g.selectedOption,
                topic: g.topicData.topic,
                memberCount: g.groupMembers.length
            }))
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
