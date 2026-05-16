const mongoose = require("mongoose");
const GenUser = require("./server/models/AdminModels/GenUserModel");
const FypRegistration = require("./server/models/StudentModels/fypRegModel");
const PanelDetails = require("./server/models/CoordinatorModels/PenalModel");
const ExamAssignment = require("./server/models/CoordinatorModels/ExamAssignment");
const ManageCLO = require("./server/models/CoordinatorModels/CLOsModel");
const QuestionsForCLO = require("./server/models/CoordinatorModels/QuesForCLOModel");
const CLOForExam = require("./server/models/CoordinatorModels/CLOForExamModel");
const Evaluation = require("./server/models/CoordinatorModels/EvaluateExamModel");
const CreateExamModel = require("./server/models/CoordinatorModels/CreateExamModel");
const ExamType = require("./server/models/CoordinatorModels/ExamTypeModel");
const FYPTerm = require("./server/models/AdminModels/fypTerm");
const Program = require("./server/models/AdminModels/program");

require("dotenv").config();

const seedMarks = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        // 1. Get Term
        const term = await FYPTerm.findOne({ sessionTerm: "Fall 2024" }) || await FYPTerm.findOne();
        if (!term) throw new Error("No Term found");
        console.log(`Using Term: ${term.sessionTerm}`);

        // 2. Get Program (BSCS)
        const prog = await Program.findOne({ shortCode: "BSCS" }) || await Program.findOne();

        // 3. Ensure CLOs & Questions exist
        console.log("Ensuring CLOs and Questions...");

        let q1 = await QuestionsForCLO.findOne({ shortCode: "Q1" });
        if (!q1) q1 = await QuestionsForCLO.create({ shortCode: "Q1", question: "System Design", marks: 50 });

        let q2 = await QuestionsForCLO.findOne({ shortCode: "Q2" });
        if (!q2) q2 = await QuestionsForCLO.create({ shortCode: "Q2", question: "Implementation", marks: 50 });

        let clo1 = await ManageCLO.findOne({ CLOCode: "CLO-1" });
        if (!clo1) clo1 = await ManageCLO.create({
            CLOCode: "CLO-1", Title: "Development", Program: prog._id, Questions: [q1._id, q2._id]
        });

        let cloForExam = await CLOForExam.findOne({ shortCode: "CLO-FE-1" });
        if (!cloForExam) cloForExam = await CLOForExam.create({
            shortCode: "CLO-FE-1", program: prog._id, CLOs: [clo1._id]
        });

        // 4. Ensure Exam Types and Templates exist
        console.log("Ensuring Exam Types...");
        const examTypes = ["Mid-I", "Final-I"];
        const loadedExams = {};

        for (const eName of examTypes) {
            const shortCode = eName.substring(0, 3).toUpperCase();

            // Upsert ExamType
            let et = await ExamType.findOneAndUpdate(
                { shortCode: shortCode },
                { examName: eName, shortCode: shortCode, examTypeFor: "Supervisor" },
                { upsert: true, new: true }
            );

            // Upsert CreateExamModel
            let createExam = await CreateExamModel.findOneAndUpdate(
                { examName: eName },
                { Term: term._id, ExamType: et._id, ExamWeightage: 100, AnnouncedDate: new Date() },
                { upsert: true, new: true }
            );

            loadedExams[eName] = createExam;
        }

        // 5. Get All FYP Groups
        const groups = await FypRegistration.find({ term: term._id }).populate('assignedPanel');
        console.log(`Found ${groups.length} groups.`);

        // 6. Create Evaluation Record for Term
        let termEval = await Evaluation.findOne({ termId: term._id });
        if (!termEval) termEval = await Evaluation.create({ termId: term._id, exams: [] });

        // 7. Iterate and Mark
        for (const eName of examTypes) {
            console.log(`Marking ${eName}...`);
            const examTemplate = loadedExams[eName];

            const examEntry = {
                examId: examTemplate._id,
                examTypeFor: "Supervisor",
                examName: eName,
                fypGroups: []
            };

            for (const group of groups) {
                if (!group.assignedPanel) continue; // Skip if no panel

                const groupEval = {
                    groupId: group._id,
                    panelId: group.assignedPanel._id,
                    approvedStatus: "approved",
                    students: []
                };

                // For each student in group
                for (const member of group.groupMembers) {
                    // Random marks between 70 and 95
                    const obtained = Math.floor(Math.random() * (95 - 70 + 1)) + 70;

                    const studentEval = {
                        studentId: member._id,
                        marks: obtained,
                        obtainedAverage: obtained,
                        evaluationsByExaminers: []
                    };

                    // Add examiners evaluations (mocking)
                    // Assuming PanelDetails structure has PanelMembers array of objects { member: Id }
                    // We need to fetch the panel details correctly first if not fully populated
                    // But 'group.assignedPanel' is populated. Let's assume it has PanelMembers.
                    const panelDetails = await PanelDetails.findById(group.assignedPanel._id);

                    if (panelDetails && panelDetails.PanelMembers) {
                        for (const pm of panelDetails.PanelMembers) {
                            studentEval.evaluationsByExaminers.push({
                                examinerId: pm.member,
                                marks: obtained,
                                totalWeightage: 100,
                                feedback: "Automated Seed Feedback",
                                evaluations: [{
                                    cloForExamId: cloForExam._id,
                                    totalCLOPercentage: 100,
                                    obtainedCLOPercentage: obtained,
                                    cloEvaluations: [{
                                        cloId: clo1._id,
                                        totalPercentage: 100,
                                        obtainedPercentage: obtained,
                                        questions: [
                                            { questionId: q1._id, marks: obtained / 2 },
                                            { questionId: q2._id, marks: obtained / 2 }
                                        ]
                                    }]
                                }]
                            });
                        }
                    }
                    groupEval.students.push(studentEval);
                }
                examEntry.fypGroups.push(groupEval);
            }

            // Remove existing exam entry if any (to avoid duplicates)
            termEval.exams = termEval.exams.filter(e => e.examName !== eName);
            termEval.exams.push(examEntry);
        }

        await termEval.save();
        console.log("SUCCESS: Marks seeded for all groups.");
        await mongoose.disconnect();

    } catch (error) {
        console.error("Error seeding marks:", error);
    }
};

seedMarks();
