const mongoose = require('mongoose');
const path = require('path');

// Models (paths relative to server root)
const FYPTerm = require('./models/AdminModels/fypTerm');
const FypRegistration = require('./models/StudentModels/fypRegModel');
const Evaluation = require('./models/CoordinatorModels/EvaluateExamModel');
const CreatedExam = require('./models/CoordinatorModels/ExamCreationModel');
const ExamType = require('./models/CoordinatorModels/examType');

// Controllers
const TermContinuationController = require('./controllers/CoordinatorController/TermContinuationController');
const ReportGenerationController = require('./controllers/CoordinatorController/ReportGenerationController');

// Mock Mock Request/Response
const mockRes = () => {
    const res = {};
    res.data = null;
    res.statusCode = 200;
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.data = data;
        return res;
    };
    return res;
};

const mockReq = (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query
});

async function runVerification() {
    console.log('--- Starting Single Term Progression Verification (Corrected) ---');

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/fyp_management_system', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('DB Connection Failed', err);
        return;
    }

    try {
        // 1. Term Setup
        const termName = `VerifyTerm-${Date.now()}`;
        const term = await FYPTerm.create({
            sessionTerm: termName,
            status: 'Active',
            startDate: new Date(),
            endDate: new Date(),
            part: 1
        });
        console.log(`Created Term: ${term.sessionTerm}`);

        // 2. Student & Registration
        const studentId = new mongoose.Types.ObjectId();
        const studentRegNo = `REG-${Date.now()}`;
        const groupId = new mongoose.Types.ObjectId();

        const reg = await FypRegistration.create({
            _id: groupId,
            groupMembers: [{
                _id: studentId,
                name: 'Test Student',
                registrationNumber: studentRegNo
            }],
            selectedOption: new mongoose.Types.ObjectId(), // Dummy User ID
            selectedTechnology: new mongoose.Types.ObjectId(),
            selectedPlatform: new mongoose.Types.ObjectId(),
            user: new mongoose.Types.ObjectId(),
            topicData: { title: 'Test Project' },
            term: term._id,
            partStatus: 'part-I',
            reqStatus: 'Approved',
            groupName: `Group-${Date.now()}`
        });
        console.log(`Created Registration (Part I): ${reg._id}`);

        // 3. Exam Types
        const examTypesList = [
            { name: 'Proposal', for: 'part-I', weight: 20 },
            { name: 'Attendance-I', for: 'part-I', weight: 20 },
            { name: 'Mid-I', for: 'part-I', weight: 20 },
            { name: 'Final-I', for: 'part-I', weight: 40 },
            { name: 'Attendance-II', for: 'part-II', weight: 20 },
            { name: 'Mid-II', for: 'part-II', weight: 20 },
            { name: 'Final-II', for: 'part-II', weight: 40 } // Total > 100 but separate parts
        ];

        const examTypeMap = {};
        for (let et of examTypesList) {
            const eType = await ExamType.findOneAndUpdate(
                { examName: et.name },
                { examName: et.name, examTypeFor: et.for, weightage: et.weight },
                { upsert: true, new: true }
            );
            examTypeMap[et.name] = eType;
        }

        // 4. Create Evaluation Structure with Part I Exams
        // Need 'CreateExamModel' instances for Term
        const partIExams = ['Proposal', 'Attendance-I', 'Mid-I', 'Final-I'];
        const partIExamSchemas = [];

        for (let name of partIExams) {
            const createdExam = await CreatedExam.create({
                examName: name,
                examDate: new Date(),
                term: term._id,
                examId: examTypeMap[name]._id,
                totalMarks: 100
            });

            partIExamSchemas.push({
                examId: createdExam._id,
                examName: name,
                examTypeFor: examTypeMap[name].examTypeFor,
                fypGroups: [{
                    groupId: reg._id,
                    students: [{
                        studentId: studentId,
                        marks: 80, // 80%
                        obtainedAverage: 80,
                        obtainedAverageofCLO: []
                    }]
                }]
            });
        }

        const evaluationDoc = await Evaluation.create({
            supervisorId: new mongoose.Types.ObjectId(),
            terms: [{
                termId: term._id,
                exams: partIExamSchemas
            }]
        });
        console.log('Created Evaluation Document');

        // 5. Test Check Part II Status (False)
        let res = mockRes();
        await ReportGenerationController.checkPartIIStatus(mockReq({}, { termId: term._id }), res);
        console.log(`Check Part II (Expect False): ${res.data.hasPartII}`);

        // 6. Test Promotion
        console.log('Promoting...');
        res = mockRes();
        await TermContinuationController.promoteGroupsToPartII(mockReq({ termId: term._id }), res);
        console.log('Promotion Status:', res.statusCode);

        // Check that the SAME registration was updated (no new document created)
        const updatedReg = await FypRegistration.findById(reg._id);
        console.log(`Registration Updated to Part II: ${updatedReg && updatedReg.partStatus === 'part-II'}`);

        // 7. Test Check Part II Status (True)
        res = mockRes();
        await ReportGenerationController.checkPartIIStatus(mockReq({}, { termId: term._id }), res);
        console.log(`Check Part II (Expect True): ${res.data.hasPartII}`);

        // 8. Add Part II Exams to Evaluation
        const partIIExams = ['Attendance-II', 'Mid-II', 'Final-II'];
        const partIIExamSchemas = [];

        for (let name of partIIExams) {
            const createdExam = await CreatedExam.create({
                examName: name,
                examDate: new Date(),
                term: term._id,
                examId: examTypeMap[name]._id,
                totalMarks: 100
            });

            partIIExamSchemas.push({
                examId: createdExam._id,
                examName: name,
                examTypeFor: examTypeMap[name].examTypeFor,
                fypGroups: [{
                    groupId: reg._id, // SAME REGISTRATION ID (in-place update)
                    students: [{
                        studentId: studentId, // SAME STUDENT ID
                        marks: 90, // 90%
                        obtainedAverage: 90,
                        obtainedAverageofCLO: []
                    }]
                }]
            });
        }

        // Update Evaluation Doc to include Part II exams in the SAME term
        evaluationDoc.terms[0].exams.push(...partIIExamSchemas);
        await evaluationDoc.save();
        console.log('Updated Evaluation with Part II Exams');

        // 9. Verify Reports

        // Helper to check keys
        const checkKeys = (data, present, absent) => {
            const keys = Object.keys(data); // In report, usually keys are 'Proposal', 'A1', etc. 
            // The controller maps exams to specific keys based on ExamType name or hardcoded mapping.
            // Let's assume it keys by Exam Name for now if dynamic, or standard keys (Proposal, Mid-I, etc.)

            // Actually, ReportGenerationController maps:
            // Part I: Proposal, Attendance-I, Mid-I, Final-I
            // Part II: Attendance-II, Mid-II, Final-II

            const hasPresent = present.every(k => data[k] !== undefined);
            const hasAbsent = absent.every(k => data[k] === undefined);
            return hasPresent && hasAbsent;
        };

        // Stubbing the registrationNumber lookup since we don't have full student population logic
        // The controller uses `reg.groupMembers.find(s => s._id.equals(studentId))?.registrationNumber`
        // We set that up in mock data step 2.

        // Part I Report
        res = mockRes();
        await ReportGenerationController.generatePortalReport(mockReq({}, { termId: term._id }, { partStatus: 'part-I' }), res);
        if (res.data.success) {
            const studentData = res.data.data[0];
            // Part I keys: Proposal, Attendance-I...
            // Part II keys: Attendance-II...

            console.log('Part I Report Keys:', Object.keys(studentData).filter(k => !['registrationNumber', 'name', 'Total'].includes(k)));
        } else {
            console.log('Part I Report Error:', res.data.error);
        }

        // Part II Report
        res = mockRes();
        await ReportGenerationController.generatePortalReport(mockReq({}, { termId: term._id }, { partStatus: 'part-II' }), res);
        if (res.data.success) {
            const studentData = res.data.data[0];
            console.log('Part II Report Keys:', Object.keys(studentData).filter(k => !['registrationNumber', 'name', 'Total'].includes(k)));
        } else {
            console.log('Part II Report Error:', res.data.error);
        }

        // Combined Report
        res = mockRes();
        await ReportGenerationController.generatePortalReport(mockReq({}, { termId: term._id }, { partStatus: 'combined' }), res);
        if (res.data.success) {
            const studentData = res.data.data[0];
            console.log('Combined Report Keys:', Object.keys(studentData).filter(k => !['registrationNumber', 'name', 'Total'].includes(k)));
        } else {
            console.log('Combined Report Error:', res.data.error);
        }

    } catch (err) {
        console.error('Runtime Error:', err);
    } finally {
        await mongoose.connection.close();
        console.log('--- Done ---');
    }
}

runVerification();
