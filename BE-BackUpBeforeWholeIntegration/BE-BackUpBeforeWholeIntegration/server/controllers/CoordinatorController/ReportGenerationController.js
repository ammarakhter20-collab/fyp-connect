const Evaluation = require("../../models/CoordinatorModels/EvaluateExamModel");
const CreatedExam = require("../../models/CoordinatorModels/ExamCreationModel");
const FYPTerm = require("../../models/AdminModels/fypTerm");
const FypRegistration = require("../../models/StudentModels/fypRegModel");
const PassFailCriteria = require("../../models/CoordinatorModels/PassFailCriteriaModel");
const mongoose = require("mongoose");

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get passing criteria for a specific term
 * @param {string} termId - Term ID
 * @returns {number} - Passing criteria percentage (default 50 if not set)
 */
const getPassingCriteriaForTerm = async (termId) => {
    try {
        const criteria = await PassFailCriteria.findOne({ term: termId });
        return criteria ? criteria.passingCriteria : 50; // Default to 50%
    } catch (error) {
        console.error('Error fetching passing criteria:', error);
        return 50; // Default to 50% on error
    }
};

/**
 * Validate that all required exams exist for a given part
 * @param {Object} evaluation - Evaluation document
 * @param {string} partStatus - 'part-I', 'part-II', or 'combined'
 * @returns {Object} - { valid: boolean, missing: array }
 */
const validateExamCompleteness = (evaluation, partStatus) => {
    if (!evaluation || !evaluation.exams) {
        return { valid: false, missing: ['All exams'] };
    }

    // Extract available exam names from the evaluation
    const examNames = evaluation.exams.map(e => e.examName);

    // Define required exams based on partStatus
    let required = [];
    if (partStatus === 'part-I') {
        required = ["Proposal", "Attendance-I", "Mid-I", "Final-I"];
    } else if (partStatus === 'part-II') {
        required = ["Attendance-II", "Mid-II", "Final-II"];
    } else {
        // Combined or unspecified - check all? 
        // For combined, strict validation might fail if some students are only Part I.
        // We permit partial completeness for combined views usually.
        return { valid: true, missing: [] };
    }

    const missing = required.filter(r => !examNames.includes(r));
    return {
        valid: missing.length === 0,
        missing: missing.length > 0 ? missing : []
    };
};

/**
 * Transform academic exam marks into portal components
 * Deduces Part I vs Part II based on ExamType
 * @param {Object} evaluation - Evaluation document with populated student data
 * @returns {Array} - Array of student objects with portal component marks
 */
const transformToPortalComponents = (evaluation) => {
    const studentsMap = {};
    
    // Odoo Slot Weights (Total 100)
    // A1-A4: 5 each (20), Q1-Q4: 5 each (20), M1-M2: 10 each (20), F1-F4: 10 each (40)
    const ODOO_LAYOUT = [
        { prefix: 'A', count: 4, weightPerSlot: 5 },
        { prefix: 'Q', count: 4, weightPerSlot: 5 },
        { prefix: 'M', count: 2, weightPerSlot: 10 },
        { prefix: 'F', count: 4, weightPerSlot: 10 }
    ];

    // STEP 1: Calculate raw total pool for each student per part
    evaluation.exams.forEach(exam => {
        const part = (exam.examId?.partStatus === "Part-I" || exam.examId?.partStatus === "part-I") ? 1 : 2;
        
        exam.fypGroups.forEach(group => {
            group.students.forEach(student => {
                const studentId = student.studentId?._id ? student.studentId?._id.toString() : student.studentId?.toString();
                if (!studentId) return;

                if (!studentsMap[studentId]) {
                    studentsMap[studentId] = {
                        studentId,
                        registrationNumber: student.studentId?.registrationNumber || 'N/A',
                        name: student.studentId?.name || 'Unknown',
                        Total_1: 0, Total_2: 0,
                        // Marks will be distributed in Step 2
                    };
                }

                const s = studentsMap[studentId];
                const marks = student.obtainedAverage || 0;

                // Add to raw pool for the correct part
                if (part === 1) s.Total_1 += marks;
                else s.Total_2 += marks;
            });
        });
    });

    // STEP 2: Distribute pools proportionally into Odoo slots
    Object.values(studentsMap).forEach(s => {
        // Round totals first
        s.Total_1 = Math.round(s.Total_1 * 100) / 100;
        s.Total_2 = Math.round(s.Total_2 * 100) / 100;

        ODOO_LAYOUT.forEach(bucket => {
            for (let i = 1; i <= bucket.count; i++) {
                // Distribute Part I
                const val1 = s.Total_1 * (bucket.weightPerSlot / 100);
                s[`${bucket.prefix}${i}_1`] = Math.round(val1 * 100) / 100;

                // Distribute Part II
                const val2 = s.Total_2 * (bucket.weightPerSlot / 100);
                s[`${bucket.prefix}${i}_2`] = Math.round(val2 * 100) / 100;
            }
        });
    });

    return Object.values(studentsMap);
};

/**
 * Transform evaluation data into Overall FYP Result format
 */
const transformToOverallResult = (evaluation) => {
    const studentsMap = {};

    evaluation.exams.forEach(exam => {
        // Use partStatus from the exam instance (ExamCreationModel)
        const part = exam.examId?.partStatus; 

        exam.fypGroups.forEach(group => {
            group.students.forEach(student => {
                const studentId = student.studentId._id ? student.studentId._id.toString() : student.studentId.toString();
                const regno = student.studentId.registrationNumber || 'N/A';
                const name = student.studentId.name || 'Unknown';
                const marks = student.obtainedAverage || 0;

                // Initialize student record
                if (!studentsMap[studentId]) {
                    studentsMap[studentId] = {
                        studentId: studentId,
                        registrationNumber: regno,
                        name: name,
                        exams: {}, // Dynamic list of exams
                        TotalPartI: 0,
                        TotalPartII: 0
                    };
                }

                const s = studentsMap[studentId];
                
                // Add the exam name and marks to the student's dynamic exams list
                const examName = exam.examId?.ExamType?.examName || 'Unknown';
                s.exams[examName] = marks;

                // Sum to the correct Part total
                if (part === "Part-I") {
                    s.TotalPartI += marks;
                } else if (part === "Part-II") {
                    s.TotalPartII += marks;
                }
            });
        });
    });

    // Rounding
    Object.values(studentsMap).forEach(student => {
        student.TotalPartI = Math.round(student.TotalPartI * 100) / 100;
        student.TotalPartII = Math.round(student.TotalPartII * 100) / 100;
    });

    return Object.values(studentsMap);
};

// ============================================================================
// MAIN CONTROLLER FUNCTIONS
// ============================================================================

/**
 * Generate Portal Report with Single Term Progression support
 * Query Param: ?partStatus=part-I | part-II | combined
 */
const generatePortalReport = async (req, res) => {
    try {
        const { termId } = req.params;
        const { partStatus } = req.query; // 'part-I', 'part-II', or undefined (combined)

        if (!mongoose.Types.ObjectId.isValid(termId)) {
            return res.status(400).json({ success: false, error: 'Invalid term ID format' });
        }

        const term = await FYPTerm.findById(termId);
        if (!term) {
            return res.status(404).json({ success: false, error: 'Term not found' });
        }

        // Fetch ALL evaluation documents for this term (from all supervisors)
        const evaluationDocs = await Evaluation.find({ "terms.termId": termId })
            .populate({
                path: 'terms.exams.examId',
                select: 'ExamWeightage ExamType partStatus portalCategory',
                populate: {
                    path: 'ExamType',
                    select: 'examName examTypeFor'
                }
            })
            .populate({
                path: 'terms.exams.fypGroups.students.studentId',
                select: 'name registrationNumber'
            });

        if (evaluationDocs.length === 0) {
            return res.status(404).json({ success: false, error: 'No evaluations found for this term' });
        }

        // Aggregate all exams from all matching term entries across all docs
        const allExams = [];
        evaluationDocs.forEach(doc => {
            const t = doc.terms.find(termEntry => termEntry.termId.toString() === termId);
            if (t && t.exams) {
                allExams.push(...t.exams);
            }
        });

        if (allExams.length === 0) {
            return res.status(404).json({ success: false, error: 'Term data not found in documents' });
        }

        // FILTER EXAMS based on partStatus if provided
        let filteredExams = allExams;
        const normalizedPartStatus = partStatus === 'part-I' ? 'Part-I' : (partStatus === 'part-II' ? 'Part-II' : null);
        
        if (normalizedPartStatus) {
            filteredExams = allExams.filter(e => {
                const dbPartStatus = e.examId?.partStatus;
                const type = e.examId?.ExamType?.examTypeFor;
                const name = e.examId?.ExamType?.examName?.toLowerCase() || "";

                // Primary check: database field
                if (dbPartStatus === normalizedPartStatus || type === normalizedPartStatus) return true;

                // Fallback check: inference by name
                if (normalizedPartStatus === 'Part-I') {
                    return name.includes('proposal') || (name.includes('attendance') && !name.includes('ii')) || (name.includes('mid') && !name.includes('ii')) || (name.includes('final') && !name.includes('ii'));
                } else if (normalizedPartStatus === 'Part-II') {
                    return (name.includes('attendance') && name.includes('ii')) || (name.includes('mid') && name.includes('ii')) || (name.includes('final') && name.includes('ii'));
                }
                return false;
            });
        }

        const consolidatedEvaluation = { exams: filteredExams };
        const portalData = transformToPortalComponents(consolidatedEvaluation);

        // --- GAP DETECTION AND NOTIFICATIONS ---
        const notifications = [];
        const EXPECTED = { Attendance: 20, Quiz: 20, Midterm: 20, Final: 40 };
        const partsToCheck = normalizedPartStatus ? [normalizedPartStatus] : ['Part-I', 'Part-II'];

        partsToCheck.forEach(p => {
            // Calculate total weight for this specific part
            const totalPartWeight = allExams
                .filter(e => e.examId?.partStatus === p)
                .reduce((sum, e) => sum + (e.examId?.ExamWeightage || 0), 0);

            Object.keys(EXPECTED).forEach(cat => {
                const allocated = filteredExams
                    .filter(e => {
                        const dbPartStatus = e.examId?.partStatus;
                        const dbCategory = e.examId?.portalCategory || 'Other';
                        if (dbPartStatus !== p) return false;
                        if (cat === 'Attendance') return dbCategory === 'Attendance' || dbCategory === 'Other';
                        return dbCategory === cat;
                    })
                    .reduce((sum, e) => sum + (e.examId?.ExamWeightage || 0), 0);

                // Only warn if the slot is completely empty AND total weightage is still lacking
                if (allocated === 0 && totalPartWeight < 100) {
                    notifications.push({
                        type: 'warning',
                        part: p,
                        slot: cat,
                        message: `Slot Incomplete: ${cat} in Part ${p} is only 0% allocated (needs ${EXPECTED[cat]}%). Please add more exams or marks before term expires.`
                    });
                }
            });
        });

        // Fetch passing criteria for this term
        const passingCriteria = await getPassingCriteriaForTerm(termId);

        // Add pass/fail status to each student
        portalData.forEach(student => {
            student.passFailPartI = student.Total_1 >= passingCriteria ? 'PASS' : 'FAIL';
            student.passFailPartII = student.Total_2 >= passingCriteria ? 'PASS' : 'FAIL';
        });

        res.status(200).json({
            success: true,
            partStatus: partStatus || 'combined',
            termName: term.sessionTerm,
            totalStudents: portalData.length,
            passingCriteria: passingCriteria,
            notifications: notifications, // New field
            data: portalData
        });

    } catch (error) {
        console.error('Error generating portal report:', error);
        res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
    }
};

/**
 * Generate Overall FYP Result
 */
const generateOverallFYPResult = async (req, res) => {
    try {
        const { termId } = req.params;
        const { partStatus } = req.query;

        if (!mongoose.Types.ObjectId.isValid(termId)) {
            return res.status(400).json({ success: false, error: 'Invalid term ID format' });
        }

        const term = await FYPTerm.findById(termId);
        if (!term) {
            return res.status(404).json({ success: false, error: 'Term not found' });
        }

        const evaluationDocs = await Evaluation.find({ "terms.termId": termId })
            .populate({
                path: 'terms.exams.examId',
                select: 'ExamWeightage ExamType partStatus portalCategory',
                populate: {
                    path: 'ExamType',
                    select: 'examName examTypeFor'
                }
            })
            .populate({
                path: 'terms.exams.fypGroups.students.studentId',
                select: 'name registrationNumber'
            });

        if (evaluationDocs.length === 0) {
            return res.status(404).json({ success: false, error: 'No evaluations found for this term' });
        }

        // Aggregate all exams across docs
        const allExams = [];
        evaluationDocs.forEach(doc => {
            const t = doc.terms.find(termEntry => termEntry.termId.toString() === termId);
            if (t && t.exams) {
                allExams.push(...t.exams);
            }
        });

        if (allExams.length === 0) {
            return res.status(404).json({ success: false, error: 'Term data not found in documents' });
        }

        // Filter based on partStatus if provided
        let filteredExams = allExams;
        const normalizedPartStatus = partStatus === 'part-I' ? 'Part-I' : (partStatus === 'part-II' ? 'Part-II' : null);

        if (normalizedPartStatus) {
            filteredExams = allExams.filter(e => {
                const dbPartStatus = e.examId?.partStatus;
                const type = e.examId?.ExamType?.examTypeFor;
                const name = e.examId?.ExamType?.examName?.toLowerCase() || "";

                if (dbPartStatus === normalizedPartStatus || type === normalizedPartStatus) return true;
                
                if (normalizedPartStatus === 'Part-I') {
                    return name.includes('proposal') || (name.includes('attendance') && !name.includes('ii')) || (name.includes('mid') && !name.includes('ii')) || (name.includes('final') && !name.includes('ii'));
                } else if (normalizedPartStatus === 'Part-II') {
                    return (name.includes('attendance') && name.includes('ii')) || (name.includes('mid') && name.includes('ii')) || (name.includes('final') && name.includes('ii'));
                }
                return false;
            });
        }

        const consolidatedEvaluation = { exams: filteredExams };
        const overallData = transformToOverallResult(consolidatedEvaluation);

        // --- GAP DETECTION ---
        const notifications = [];
        const partsToCheck = normalizedPartStatus ? [normalizedPartStatus] : ['Part-I', 'Part-II'];
        partsToCheck.forEach(p => {
            const totalWeight = filteredExams
                .filter(e => e.examId?.partStatus === p)
                .reduce((sum, e) => sum + (e.examId?.ExamWeightage || 0), 0);
            
            if (totalWeight < 100) {
                notifications.push({
                    type: 'info',
                    part: p,
                    message: `Part ${p} is incomplete: Total weight is ${totalWeight}% (needs 100%). Results will be Wait/Zero for missing slots.`
                });
            }
        });

        // Fetch passing criteria for this term
        const passingCriteria = await getPassingCriteriaForTerm(termId);

        // Add pass/fail status to each student
        overallData.forEach(student => {
            student.passFailPartI = student.TotalPartI >= passingCriteria ? 'PASS' : 'FAIL';
            student.passFailPartII = student.TotalPartII >= passingCriteria ? 'PASS' : 'FAIL';
        });

        res.status(200).json({
            success: true,
            partStatus: partStatus || 'combined',
            termName: term.sessionTerm,
            totalStudents: overallData.length,
            passingCriteria: passingCriteria,
            notifications: notifications,
            data: overallData
        });

    } catch (error) {
        console.error('Error generating overall FYP result:', error);
        res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
    }
};

/**
 * Check if the current term has any Part II students (indicating promotion happened)
 * Used to toggle "View Part II / Combined" UI
 */
const checkPartIIStatus = async (req, res) => {
    try {
        const { termId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(termId)) {
            return res.status(400).json({ success: false, error: 'Invalid term ID format' });
        }

        const partIICount = await FypRegistration.countDocuments({
            term: termId,
            partStatus: 'part-II'
        });

        res.status(200).json({
            success: true,
            hasPartII: partIICount > 0,
            partIICount: partIICount
        });

    } catch (error) {
        console.error('Error checking Part II status:', error);
        res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
    }
};

/**
 * Generate Project-Wise Report
 * Shows aggregated pass/fail status per project
 */
const generateProjectWiseReport = async (req, res) => {
    try {
        const { termId } = req.params;
        const { partStatus } = req.query;

        if (!mongoose.Types.ObjectId.isValid(termId)) {
            return res.status(400).json({ success: false, error: 'Invalid term ID format' });
        }

        const term = await FYPTerm.findById(termId);
        if (!term) {
            return res.status(404).json({ success: false, error: 'Term not found' });
        }

        // Fetch passing criteria
        const passingCriteria = await getPassingCriteriaForTerm(termId);

        // Fetch all FYP groups for this term
        const fypGroups = await FypRegistration.find({ term: termId })
            .populate('selectedOption', 'name')
            .populate('selectedTechnology', 'name')
            .populate('selectedPlatform', 'name');

        if (fypGroups.length === 0) {
            return res.status(404).json({ success: false, error: 'No FYP groups found for this term' });
        }

        // Fetch evaluation data for the term to get student marks
        const evaluationDocs = await Evaluation.find({ "terms.termId": termId })
            .populate({
                path: 'terms.exams.examId',
                select: 'ExamWeightage ExamType partStatus portalCategory',
                populate: {
                    path: 'ExamType',
                    select: 'examName examTypeFor'
                }
            })
            .populate({
                path: 'terms.exams.fypGroups.students.studentId',
                select: 'name registrationNumber'
            });

        // Aggregate all exams
        const allExams = [];
        evaluationDocs.forEach(doc => {
            const t = doc.terms.find(termEntry => termEntry.termId.toString() === termId);
            if (t && t.exams) {
                allExams.push(...t.exams);
            }
        });

        // Build a map of student results (studentId -> {totalPartI, totalPartII, passFailPartI, passFailPartII})
        const studentResultsMap = {};

        allExams.forEach(exam => {
            const examTypeFor = exam.examId?.ExamType?.examTypeFor;
            const examName = (exam.examId?.ExamType?.examName || exam.examName || "").toLowerCase();

            let inferredPart = null;
            if (examTypeFor === 'part-I' || examTypeFor === 'part-i') inferredPart = 1;
            else if (examTypeFor === 'part-II' || examTypeFor === 'part-ii') inferredPart = 2;
            else {
                if (examName.includes('proposal') || (examName.includes('attendance') && !examName.includes('ii')) || (examName.includes('mid') && !examName.includes('ii')) || (examName.includes('final') && !examName.includes('ii'))) {
                    inferredPart = 1;
                } else if ((examName.includes('attendance') && examName.includes('ii')) || (examName.includes('mid') && examName.includes('ii')) || (examName.includes('final') && examName.includes('ii'))) {
                    inferredPart = 2;
                }
            }

            exam.fypGroups.forEach(group => {
                group.students.forEach(student => {
                    const studentId = student.studentId?._id ? student.studentId._id.toString() : student.studentId?.toString();
                    if (!studentId) return;

                    const regno = student.studentId?.registrationNumber || 'N/A';
                    const name = student.studentId?.name || 'Unknown';
                    const marks = student.obtainedAverage || 0;

                    if (!studentResultsMap[studentId]) {
                        studentResultsMap[studentId] = {
                            studentId,
                            name,
                            registrationNumber: regno,
                            totalPartI: 0,
                            totalPartII: 0
                        };
                    }

                    if (inferredPart === 1) {
                        studentResultsMap[studentId].totalPartI += marks;
                    } else if (inferredPart === 2) {
                        studentResultsMap[studentId].totalPartII += marks;
                    }
                });
            });
        });

        // Calculate pass/fail for each student
        Object.values(studentResultsMap).forEach(student => {
            student.totalPartI = Math.round(student.totalPartI * 100) / 100;
            student.totalPartII = Math.round(student.totalPartII * 100) / 100;
            student.passFailPartI = student.totalPartI >= passingCriteria ? 'PASS' : 'FAIL';
            student.passFailPartII = student.totalPartII >= passingCriteria ? 'PASS' : 'FAIL';
        });

        // Build project reports
        const projectReports = fypGroups.map(group => {
            // Get member IDs from the group
            const memberIds = group.groupMembers.map(m => m._id.toString());

            // Get results for all members
            const memberResults = memberIds.map(id => studentResultsMap[id]).filter(Boolean);

            // Calculate project-level pass/fail
            // Project passes if AT LEAST ONE student passes
            const projectPassPartI = memberResults.some(s => s.passFailPartI === 'PASS') ? 'PASS' : 'FAIL';
            const projectPassPartII = memberResults.some(s => s.passFailPartII === 'PASS') ? 'PASS' : 'FAIL';

            return {
                projectId: group._id,
                projectName: group.topicData?.title || group.topicData?.topicTitle || 'Untitled Project',
                projectType: group.selectedTechnology?.name || 'N/A',
                platform: group.selectedPlatform?.name || 'N/A',
                supervisor: group.selectedOption?.name || 'N/A',
                groupMembers: group.groupMembers.map(m => ({
                    studentId: m._id,
                    name: m.name,
                    registrationNumber: m.registrationNumber,
                    ...studentResultsMap[m._id.toString()]
                })),
                memberResults,
                projectPassPartI,
                projectPassPartII,
                finalDocument: group.finalDocument || null,
                hasPartIIDocument: !!group.finalDocument
            };
        });

        res.status(200).json({
            success: true,
            termName: term.sessionTerm,
            passingCriteria,
            totalProjects: projectReports.length,
            data: projectReports
        });

    } catch (error) {
        console.error('Error generating project-wise report:', error);
        res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
    }
};

/**
 * Get a single student's Overall FYP Report
 * Only returns real data when ALL exams in both Part I & Part II are:
 *   - status === "Completed"
 *   - Total weightage for each part === 100
 *
 * Route: GET /api/EvaluateExamRoutes/student-overall-report/:termId/:studentId
 */
const getStudentOverallReport = async (req, res) => {
    try {
        const { termId, studentId } = req.params;

        // Security: student may only fetch their own report
        if (req.user_id && req.user_id.toString() !== studentId.toString()) {
            return res.status(403).json({ success: false, error: 'Forbidden: you may only view your own report' });
        }

        if (!mongoose.Types.ObjectId.isValid(termId) || !mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ success: false, error: 'Invalid ID format' });
        }

        // ── 1. Load the term ────────────────────────────────────────────────
        const term = await FYPTerm.findById(termId);
        if (!term) {
            return res.status(404).json({ success: false, error: 'Term not found' });
        }

        // ── 2. Load ALL created exams for this term ──────────────────────────
        const allCreatedExams = await CreatedExam.find({ Term: termId })
            .populate('ExamType', 'examName examTypeFor');

        const partIExams  = allCreatedExams.filter(e => e.partStatus === 'Part-I');
        const partIIExams = allCreatedExams.filter(e => e.partStatus === 'Part-II');

        // ── 3. Gate check ────────────────────────────────────────────────────
        const partIWeightage   = partIExams.reduce((s, e) => s + (e.ExamWeightage || 0), 0);
        const partIIWeightage  = partIIExams.reduce((s, e) => s + (e.ExamWeightage || 0), 0);

        const partICompleted   = partIExams.every(e => e.status === 'Completed');
        const partIICompleted  = partIIExams.every(e => e.status === 'Completed');

        const partIReady  = partICompleted  && partIWeightage  === 100;
        const partIIReady = partIICompleted && partIIWeightage === 100;

        const pendingPartI  = partIExams.filter(e => e.status !== 'Completed').map(e => e.ExamType?.examName || 'Unknown');
        const pendingPartII = partIIExams.filter(e => e.status !== 'Completed').map(e => e.ExamType?.examName || 'Unknown');

        if (!partIReady || !partIIReady) {
            return res.status(200).json({
                ready: false,
                message: 'Results not yet finalized. All exams must be completed with 100% weightage.',
                partIStatus: {
                    totalWeightage: partIWeightage,
                    isWeightageComplete: partIWeightage === 100,
                    allExamsCompleted: partICompleted,
                    completedExams: partIExams.filter(e => e.status === 'Completed').length,
                    totalExams: partIExams.length,
                    pendingExams: pendingPartI
                },
                partIIStatus: {
                    totalWeightage: partIIWeightage,
                    isWeightageComplete: partIIWeightage === 100,
                    allExamsCompleted: partIICompleted,
                    completedExams: partIIExams.filter(e => e.status === 'Completed').length,
                    totalExams: partIIExams.length,
                    pendingExams: pendingPartII.length > 0 ? pendingPartII : (partIIExams.length === 0 ? ['Not started yet'] : [])
                }
            });
        }

        // ── 4. Fetch evaluation data for this student ────────────────────────
        const evaluationDocs = await Evaluation.find({ 'terms.termId': termId })
            .populate({
                path: 'terms.exams.examId',
                select: 'ExamWeightage ExamType partStatus',
                populate: { path: 'ExamType', select: 'examName' }
            })
            .populate({
                path: 'terms.exams.fypGroups.students.studentId',
                select: 'name registrationNumber'
            });

        // Aggregate all exams for this term across docs
        const allExamEntries = [];
        evaluationDocs.forEach(doc => {
            const termEntry = doc.terms.find(t => t.termId.toString() === termId);
            if (termEntry && termEntry.exams) {
                allExamEntries.push(...termEntry.exams);
            }
        });

        // Build student mark map: examName → obtainedAverage
        const studentMarksByExam = {};
        let studentName = 'Unknown';
        let studentRegNo = 'N/A';

        allExamEntries.forEach(exam => {
            const examName    = exam.examId?.ExamType?.examName || exam.examName || 'Unknown';
            const examPart    = exam.examId?.partStatus || '';
            const examWeight  = exam.examId?.ExamWeightage || 0;

            exam.fypGroups.forEach(group => {
                group.students.forEach(s => {
                    const sId = s.studentId?._id ? s.studentId._id.toString() : s.studentId?.toString();
                    if (sId !== studentId.toString()) return;

                    // Grab student info once
                    if (studentName === 'Unknown' && s.studentId?.name) {
                        studentName = s.studentId.name;
                        studentRegNo = s.studentId.registrationNumber || 'N/A';
                    }

                    studentMarksByExam[examName] = {
                        marks: Math.round((s.obtainedAverage || 0) * 100) / 100,
                        weightage: examWeight,
                        part: examPart
                    };
                });
            });
        });

        // ── 5. Build part totals and exam arrays ─────────────────────────────
        const partIExamResults = partIExams.map(e => ({
            name: e.ExamType?.examName || 'Unknown',
            weightage: e.ExamWeightage,
            marks: studentMarksByExam[e.ExamType?.examName]?.marks ?? 0
        }));

        const partIIExamResults = partIIExams.map(e => ({
            name: e.ExamType?.examName || 'Unknown',
            weightage: e.ExamWeightage,
            marks: studentMarksByExam[e.ExamType?.examName]?.marks ?? 0
        }));

        const totalPartI  = Math.round(partIExamResults.reduce((s, e) => s + e.marks, 0) * 100) / 100;
        const totalPartII = Math.round(partIIExamResults.reduce((s, e) => s + e.marks, 0) * 100) / 100;
        const overallPercentage = Math.round(((totalPartI + totalPartII) / 2) * 100) / 100;

        const passingCriteria = await getPassingCriteriaForTerm(termId);
        const passFail = overallPercentage >= passingCriteria ? 'PASS' : 'FAIL';

        return res.status(200).json({
            ready: true,
            student: { name: studentName, registrationNumber: studentRegNo },
            termName: term.sessionTerm,
            partI: { total: totalPartI, exams: partIExamResults },
            partII: { total: totalPartII, exams: partIIExamResults },
            overallPercentage,
            passFail,
            passingCriteria
        });

    } catch (error) {
        console.error('Error fetching student overall report:', error);
        return res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
    }
};

module.exports = {
    generatePortalReport,
    generateOverallFYPResult,
    checkPartIIStatus,
    generateProjectWiseReport,
    getStudentOverallReport
};