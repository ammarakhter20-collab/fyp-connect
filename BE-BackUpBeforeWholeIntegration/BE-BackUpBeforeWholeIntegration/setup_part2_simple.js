const mongoose = require("mongoose");
require("dotenv").config();

const FYPTerm = require("./server/models/AdminModels/fypTerm");
const FypRegistration = require("./server/models/StudentModels/fypRegModel");
const Evaluation = require("./server/models/CoordinatorModels/EvaluateExamModel");
const CreateExamModel = require("./server/models/CoordinatorModels/ExamCreationModel");
const ExamType = require("./server/models/CoordinatorModels/ExamTypeModel");

async function setupPart2() {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        // 1. Create term 231-2
        let term2 = await FYPTerm.findOne({ sessionTerm: "231-2" });
        if (!term2) {
            term2 = await FYPTerm.create({
                sessionTerm: "231-2",
                startDate: new Date("2024-02-01"),
                endDate: new Date("2024-06-30"),
                status: "activated"
            });
            console.log("Created term 231-2:", term2._id);
        } else {
            console.log("Term 231-2 already exists:", term2._id);
        }

        // 2. Find term 231-1
        const term1 = await FYPTerm.findOne({ sessionTerm: "231-1" });
        if (!term1) {
            console.error("Term 231-1 not found!");
            process.exit(1);
        }
        console.log("Found term 231-1:", term1._id);

        // 3. Find groups in 231-1
        const part1Groups = await FypRegistration.find({
            term: term1._id,
            reqStatus: 'approved'
        }).populate('groupMembers');

        console.log(`Found ${part1Groups.length} groups in Part I`);

        // 4. Promote groups
        for (const g1 of part1Groups) {
            const existing = await FypRegistration.findOne({
                term: term2._id,
                'groupMembers.0._id': g1.groupMembers[0]._id
            });

            if (!existing) {
                await FypRegistration.create({
                    groupMembers: g1.groupMembers,
                    selectedOption: g1.selectedOption,
                    selectedTechnology: g1.selectedTechnology,
                    topicData: g1.topicData,
                    selectedPlatform: g1.selectedPlatform,
                    reqStatus: 'approved',
                    user: g1.user,
                    term: term2._id,
                    partStatus: 'part-II',
                    assignedPanel: g1.assignedPanel
                });
                console.log(`Promoted group ${g1._id}`);
            }
        }

        // 5. Create Part II exams
        const exams = [
            { name: "Attendance-II", weight: 40 },
            { name: "Mid-II", weight: 20 },
            { name: "Final-II", weight: 40 }
        ];

        for (const exam of exams) {
            let examType = await ExamType.findOne({ examName: exam.name });
            if (!examType) {
                examType = await ExamType.create({ examName: exam.name });
            }

            let created = await CreateExamModel.findOne({
                ExamName: exam.name,
                Term: term2._id
            });

            if (!created) {
                created = await CreateExamModel.create({
                    ExamName: exam.name,
                    ExamWeightage: exam.weight,
                    Term: term2._id
                });
                console.log(`Created exam: ${exam.name}`);
            }
        }

        // 6. Add evaluation marks
        const part2Groups = await FypRegistration.find({
            term: term2._id,
            partStatus: 'part-II'
        });

        const supervisorIds = [...new Set(part2Groups.map(g => g.selectedOption.toString()))];

        for (const supId of supervisorIds) {
            let evaluation = await Evaluation.findOne({ supervisorId: supId });
            if (!evaluation) {
                evaluation = await Evaluation.create({ supervisorId: supId, terms: [] });
            }

            let termLayer = evaluation.terms.find(t => t.termId.toString() === term2._id.toString());
            if (!termLayer) {
                evaluation.terms.push({ termId: term2._id, exams: [] });
                termLayer = evaluation.terms[evaluation.terms.length - 1];
            }

            const supGroups = part2Groups.filter(g => g.selectedOption.toString() === supId);

            for (const exam of exams) {
                const createdExam = await CreateExamModel.findOne({
                    ExamName: exam.name,
                    Term: term2._id
                });

                let examLayer = termLayer.exams.find(e => e.examId && e.examId.toString() === createdExam._id.toString());
                if (!examLayer) {
                    termLayer.exams.push({
                        examId: createdExam._id,
                        examName: exam.name,
                        fypGroups: []
                    });
                    examLayer = termLayer.exams[termLayer.exams.length - 1];
                }

                for (const group of supGroups) {
                    let groupInExam = examLayer.fypGroups.find(g => g.fypGroupId && g.fypGroupId.toString() === group._id.toString());
                    if (!groupInExam) {
                        examLayer.fypGroups.push({
                            fypGroupId: group._id,
                            students: []
                        });
                        groupInExam = examLayer.fypGroups[examLayer.fypGroups.length - 1];
                    }

                    for (const member of group.groupMembers) {
                        const marks = Math.floor(Math.random() * 26) + 70;
                        const existing = groupInExam.students.find(s => s.studentId.toString() === member._id.toString());
                        if (!existing) {
                            groupInExam.students.push({
                                studentId: member._id,
                                obtainedAverage: marks
                            });
                        }
                    }
                }
            }

            await evaluation.save();
            console.log(`Saved evaluation for supervisor ${supId}`);
        }

        console.log("\nSUCCESS! Part II data created.");
        console.log("Now refresh your Results page and the button should appear!");

        await mongoose.disconnect();
    } catch (err) {
        console.error("ERROR:", err.message);
        console.error(err.stack);
        process.exit(1);
    }
}

setupPart2();
