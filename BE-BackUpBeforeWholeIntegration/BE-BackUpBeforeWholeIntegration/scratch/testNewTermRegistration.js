const mongoose = require("mongoose");
const GenUser = require("../server/models/AdminModels/GenUserModel");
const Department = require("../server/models/AdminModels/department");
const Program = require("../server/models/AdminModels/program");
const FYPTerm = require("../server/models/AdminModels/fypTerm");
const FypRegistration = require("../server/models/StudentModels/fypRegModel");
const Technology = require("../server/models/CoordinatorModels/Technology");
const Platform = require("../server/models/CoordinatorModels/PlatformModel");

const { getFypData } = require("../server/controllers/StudentCont/fypRegController");

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("Connected to MongoDB successfully.\n");

    const db = mongoose.connection.db;

    // 1. Fetch or create baseline dependencies
    const dept = await Department.findOne({});
    const prog = await Program.findOne({});
    let tech = await Technology.findOne({});
    let plat = await Platform.findOne({});

    if (!dept || !prog) {
      console.error("Missing baseline department or program. Please seed the DB.");
      process.exit(1);
    }
    if (!tech) {
      tech = new Technology({ techName: "Test Node.js", description: "Node Technology" });
      await tech.save();
    }
    if (!plat) {
      plat = new Platform({ platformName: "Test Web Platform" });
      await plat.save();
    }

    // Ensure we have two distinct terms: Term A (old) and Term B (new)
    let termA = await FYPTerm.findOne({ sessionTerm: "Fall-2025" });
    if (!termA) {
      termA = new FYPTerm({
        sessionTerm: "Fall-2025",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2026-01-31"),
        status: "deactivated"
      });
      await termA.save();
    }
    let termB = await FYPTerm.findOne({ sessionTerm: "Spring-2026" });
    if (!termB) {
      termB = new FYPTerm({
        sessionTerm: "Spring-2026",
        startDate: new Date("2026-02-01"),
        endDate: new Date("2026-06-30"),
        status: "activated"
      });
      await termB.save();
    }

    const testEmail = "re_enroll_student@example.com";
    const testRegNum = "MOCK-RE-ENROLL-101";

    // Clean up any leftover test data
    await GenUser.deleteMany({ email: testEmail });
    await FypRegistration.deleteMany({ "groupMembers.registrationNumber": testRegNum });

    console.log("--- STEP 1: Creating Student in Term A ---");
    const student = new GenUser({
      name: "Re-Enroll Student Test",
      email: testEmail,
      role: "Student",
      department: dept._id,
      program: prog._id,
      term: termA._id,
      password: "password123",
      registrationNumber: testRegNum,
      partStatus: "part-I"
    });
    await student.save();
    console.log(`Student created. ID=${student._id}, Term=${termA.sessionTerm}`);

    console.log("\n--- STEP 2: Creating Group A (Term A) ---");
    const groupA = new FypRegistration({
      groupMembers: [{
        _id: student._id,
        name: student.name,
        email: student.email,
        registrationNumber: student.registrationNumber,
        role: student.role,
        term: termA._id
      }],
      selectedOption: student._id, // mock supervisor reference
      selectedTechnology: tech._id,
      topicData: { topic: "Old Term A Project", description: "Old Description", category: "Web" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: student._id,
      term: termA._id
    });
    await groupA.save();
    console.log(`Group A created: ID=${groupA._id}, Term=${termA.sessionTerm}, Members Count=${groupA.groupMembers.length}`);

    console.log("\n--- STEP 3: Simulating Failure in Term A Continuation ---");
    // Update student: set status to failed-part-I and term to null
    await GenUser.findByIdAndUpdate(student._id, {
      $set: {
        partStatus: "failed-part-I",
        term: null
      }
    });

    // Remove failed student from Group A members (simulating the continuation pull)
    groupA.groupMembers = [];
    groupA.partStatus = "failed-part-I";
    await groupA.save();
    console.log("Updated Group A: status = failed-part-I, members list cleared.");

    console.log("\n--- STEP 4: Registering Student in Term B (Re-enrollment) ---");
    // To register them in another term, we update their existing GenUser record
    const updatedStudent = await GenUser.findByIdAndUpdate(
      student._id,
      {
        $set: {
          term: termB._id,
          partStatus: "part-I"
        }
      },
      { new: true }
    );
    console.log(`Student re-enrolled in DB: ID=${updatedStudent._id}, Term=${termB.sessionTerm}, Status=${updatedStudent.partStatus}`);

    console.log("\n--- STEP 5: Creating Group B (Term B) ---");
    const groupB = new FypRegistration({
      groupMembers: [{
        _id: updatedStudent._id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        registrationNumber: updatedStudent.registrationNumber,
        role: updatedStudent.role,
        term: termB._id
      }],
      selectedOption: student._id, // mock supervisor reference
      selectedTechnology: tech._id,
      topicData: { topic: "New Term B Project", description: "New Description", category: "Web" },
      selectedPlatform: plat._id,
      reqStatus: "approved",
      user: updatedStudent._id,
      term: termB._id
    });
    await groupB.save();
    console.log(`Group B created: ID=${groupB._id}, Term=${termB.sessionTerm}, Members Count=${groupB.groupMembers.length}`);

    console.log("\n--- STEP 6: Verifying Student Group Fetching (getFypData) ---");
    // Mock the Express res/req objects to query getFypData for the student
    let responseStatus = null;
    let responseData = null;
    const mockRes = {
      status(code) {
        responseStatus = code;
        return this;
      },
      json(data) {
        responseData = data;
        return this;
      }
    };
    const mockReq = {
      query: {
        registrationNumber: testRegNum
      }
    };

    await getFypData(mockReq, mockRes);
    console.log("Response Status from getFypData:", responseStatus);
    
    const fyps = responseData.FYPDatas || [];
    console.log(`Number of groups returned for student ${testRegNum}: ${fyps.length}`);
    fyps.forEach((fyp, index) => {
      console.log(`Group #${index + 1}: ID=${fyp._id}, Topic="${fyp.topicData.topic}", Term=${fyp.term.sessionTerm || fyp.term}`);
    });

    if (fyps.length === 1 && fyps[0].topicData.topic === "New Term B Project") {
      console.log("\nSUCCESS: No duplication. The student only sees their active Term B project, and the old Term A project does not interfere.");
    } else {
      console.log("\nFAILURE: Duplication or incorrect group returned.");
    }

    // Cleanup
    await GenUser.deleteMany({ email: testEmail });
    await FypRegistration.deleteMany({ _id: { $in: [groupA._id, groupB._id] } });
    console.log("\nCleanup completed.");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Test failed with error:", error);
    await mongoose.disconnect();
  }
}

run();
