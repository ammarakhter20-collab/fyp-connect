const mongoose = require('mongoose');
require('dotenv').config();

require('./server/models/AdminModels/fypTerm');
require('./server/models/CoordinatorModels/ExamTypeModel');
require('./server/models/CoordinatorModels/ExamCreationModel');
require('./server/models/StudentModels/fypRegModel');
require('./server/models/AdminModels/GenUserModel');
const Evaluation = require('./server/models/CoordinatorModels/EvaluateExamModel');

// ═══════════════════════════════════════════════════════════════
// NEW CONTROLLER LOGIC COPY
// ═══════════════════════════════════════════════════════════════
const transformToPortalComponents = (evaluation) => {
    const studentsMap = {};
    const weightageMap = {};

    // 1. Build Weightage Map
    evaluation.exams.forEach(exam => {
        const weight = (exam.examId && exam.examId.ExamWeightage) ? exam.examId.ExamWeightage : 0;
        weightageMap[exam.examName] = weight;
    });

    // 2. Process Exams
    evaluation.exams.forEach(exam => {
        // Infer Part
        let inferredPart = 1;
        const name = exam.examId?.ExamType?.examName || exam.examName || "";
        if (['Attendance-II', 'Mid-II', 'Final-II'].includes(name)) inferredPart = 2;

        exam.fypGroups.forEach(group => {
            group.students.forEach(student => {
                const studentId = student.studentId._id ? student.studentId._id.toString() : student.studentId.toString();
                const regno = student.studentId.registrationNumber || 'N/A';
                const name = student.studentId.name || 'Unknown';
                const marks = student.obtainedAverage || 0;

                if (!studentsMap[studentId]) {
                    studentsMap[studentId] = {
                        studentId: studentId,
                        registrationNumber: regno,
                        name: name,
                        // PART 1 INITIALIZATION
                        A1_1: 0, A2_1: 0, A3_1: 0, A4_1: 0,
                        Q1_1: 0, Q2_1: 0, Q3_1: 0, Q4_1: 0,
                        M1_1: 0, M2_1: 0,
                        F1_1: 0, F2_1: 0, F3_1: 0, F4_1: 0,
                        Total_1: 0,

                        // PART 2 INITIALIZATION
                        A1_2: 0, A2_2: 0, A3_2: 0, A4_2: 0,
                        Q1_2: 0, Q2_2: 0, Q3_2: 0, Q4_2: 0,
                        M1_2: 0, M2_2: 0,
                        F1_2: 0, F2_2: 0, F3_2: 0, F4_2: 0,
                        Total_2: 0
                    };
                }

                const s = studentsMap[studentId];

                // ═══════════════════════════════════════════════════════════════
                // PART I MAPPING (Proposal, Att-I, Mid-I, Final-I)
                // ═══════════════════════════════════════════════════════════════
                if (inferredPart === 1) {
                    if (name === "Proposal") {
                        s.Q1_1 += marks / 4;
                        s.Q2_1 += marks / 4;
                        s.Q3_1 += marks / 4;
                        s.Q4_1 += marks / 4;
                    }
                    else if (name === "Attendance-I") {
                        s.A1_1 += marks / 4;
                        s.A2_1 += marks / 4;
                        s.A3_1 += marks / 4;
                        s.A4_1 += marks / 4;
                    }
                    else if (name === "Mid-I") {
                        s.M1_1 += marks / 2;
                        s.M2_1 += marks / 2;
                    }
                    else if (name === "Final-I") {
                        s.F1_1 += marks / 4;
                        s.F2_1 += marks / 4;
                        s.F3_1 += marks / 4;
                        s.F4_1 += marks / 4;
                    }
                }
                // ═══════════════════════════════════════════════════════════════
                // PART II MAPPING (Att-II, Mid-II, Final-II)
                // ═══════════════════════════════════════════════════════════════
                else if (inferredPart === 2) {
                    if (name === "Attendance-II") {
                        s.A1_2 += marks / 4;
                        s.A2_2 += marks / 4;
                        s.A3_2 += marks / 4;
                        s.A4_2 += marks / 4;

                        s.Q1_2 += marks / 4;
                        s.Q2_2 += marks / 4;
                        s.Q3_2 += marks / 4;
                        s.Q4_2 += marks / 4;
                    }
                    else if (name === "Mid-II") {
                        s.M1_2 += marks / 2;
                        s.M2_2 += marks / 2;
                    }
                    else if (name === "Final-II") {
                        s.F1_2 += marks / 4;
                        s.F2_2 += marks / 4;
                        s.F3_2 += marks / 4;
                        s.F4_2 += marks / 4;
                    }
                }
            });
        });
    });

    // Calculate totals for each student
    Object.values(studentsMap).forEach(student => {
        const rawTotal1 =
            student.A1_1 + student.A2_1 + student.A3_1 + student.A4_1 +
            student.Q1_1 + student.Q2_1 + student.Q3_1 + student.Q4_1 +
            student.M1_1 + student.M2_1 +
            student.F1_1 + student.F2_1 + student.F3_1 + student.F4_1;

        const rawTotal2 =
            student.A1_2 + student.A2_2 + student.A3_2 + student.A4_2 +
            student.Q1_2 + student.Q2_2 + student.Q3_2 + student.Q4_2 +
            student.M1_2 + student.M2_2 +
            student.F1_2 + student.F2_2 + student.F3_2 + student.F4_2;

        student.Total_1 = Math.round(rawTotal1 * 100) / 100;
        student.Total_2 = Math.round(rawTotal2 * 100) / 100;

        // Round sub-columns for display
        ['A1_1', 'A2_1', 'A3_1', 'A4_1', 'Q1_1', 'Q2_1', 'Q3_1', 'Q4_1', 'M1_1', 'M2_1', 'F1_1', 'F2_1', 'F3_1', 'F4_1',
            'A1_2', 'A2_2', 'A3_2', 'A4_2', 'Q1_2', 'Q2_2', 'Q3_2', 'Q4_2', 'M1_2', 'M2_2', 'F1_2', 'F2_2', 'F3_2', 'F4_2']
            .forEach(k => {
                student[k] = parseFloat(student[k].toFixed(2));
            });
    });

    return Object.values(studentsMap);
};


async function verify() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const termId = "697b64c756273c082e9eba85"; // Term 121

        // Fetch Logic (Simplified from Controller)
        const evaluationDocs = await Evaluation.find({ "terms.termId": termId })
            .populate({
                path: 'terms.exams.examId',
                select: 'ExamWeightage ExamType',
                populate: {
                    path: 'ExamType',
                    select: 'examName examTypeFor'
                }
            })
            .populate({
                path: 'terms.exams.fypGroups.students.studentId',
                select: 'name registrationNumber'
            });

        // Consolidate
        const consolidated = {
            exams: []
        };
        evaluationDocs.forEach(doc => {
            const t = doc.terms.find(termEntry => termEntry.termId.toString() === termId);
            if (t && t.exams) {
                consolidated.exams.push(...t.exams);
            }
        });

        const result = transformToPortalComponents(consolidated);
        console.log(JSON.stringify(result, null, 2));

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

verify();
