const mongoose = require("mongoose");
process.env.TOKEN_KEY = "testsecretkey";
const GenUser = require("../server/models/AdminModels/GenUserModel");
const Department = require("../server/models/AdminModels/department");
const Program = require("../server/models/AdminModels/program");
const FYPTerm = require("../server/models/AdminModels/fypTerm");

const { updateStudentData } = require("../server/controllers/AdminCont/GenUserController");

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("=============================================================");
    console.log("CONNECTED TO DATABASE. Starting Auto-Reset Status Verification...");
    console.log("=============================================================\n");

    // 1. Seed Department & Program
    let dept = await Department.findOne({ departmentName: "Computer Science" });
    if (!dept) {
      dept = new Department({ departmentName: "Computer Science" });
      await dept.save();
    }
    let progSE = await Program.findOne({ shortCode: "SE" });
    if (!progSE) {
      progSE = new Program({ programTitle: "Software Engineering", shortCode: "SE", department: dept._id });
      await progSE.save();
    }

    // 2. Seed Terms
    const termA = new FYPTerm({
      sessionTerm: "AUTO-TERM-OLD",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-01-31"),
      status: "deactivated"
    });
    await termA.save();

    const termB = new FYPTerm({
      sessionTerm: "AUTO-TERM-NEW",
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-06-30"),
      status: "activated"
    });
    await termB.save();

    // 3. Test Student 1: Failed Part-I (term: null, partStatus: 'failed-part-I')
    const student1 = new GenUser({
      name: "Part-I Fail Student",
      email: "part1_fail@example.com",
      role: "Student",
      department: dept._id,
      program: progSE._id,
      term: null,
      password: "password123",
      registrationNumber: "REG-PART1-FAIL",
      partStatus: "failed-part-I"
    });
    await student1.save();

    // 4. Test Student 2: Active in Part-II but now fails and starts over (term: termA, partStatus: 'part-II')
    const student2 = new GenUser({
      name: "Part-II Fail Student",
      email: "part2_fail@example.com",
      role: "Student",
      department: dept._id,
      program: progSE._id,
      term: termA._id,
      password: "password123",
      registrationNumber: "REG-PART2-FAIL",
      partStatus: "part-II"
    });
    await student2.save();

    console.log("Initial state of Student 1 (Failed Part-I):");
    console.log(`- ID: ${student1._id}, Status: "${student1.partStatus}", Term: ${student1.term}`);
    
    console.log("Initial state of Student 2 (Failed Part-II):");
    console.log(`- ID: ${student2._id}, Status: "${student2.partStatus}", Term: ${student2.term}`);

    // Helper to call updateStudentData
    const callUpdateStudent = async (studentId, details) => {
      let responseStatus = null;
      let responseData = null;
      const res = {
        status(code) {
          responseStatus = code;
          return this;
        },
        json(data) {
          responseData = data;
          return this;
        }
      };
      const req = {
        body: {
          studentId: studentId.toString(),
          ...details
        }
      };
      await updateStudentData(req, res);
      return { status: responseStatus, data: responseData };
    };

    console.log("\n--- Executing updateStudentData for Student 1 (Failed Part-I) to New Term B ---");
    const res1 = await callUpdateStudent(student1._id, {
      registrationNumber: student1.registrationNumber,
      studentName: student1.name,
      term: termB._id.toString(),
      program: progSE._id.toString(),
      department: dept._id.toString()
    });

    console.log(`Response Status: ${res1.status}`);
    const updatedUser1 = await GenUser.findById(student1._id);
    console.log(`Updated Student 1 state in DB:`);
    console.log(`- Term in DB: ${updatedUser1.term} (Expected New Term: ${termB._id})`);
    console.log(`- PartStatus in DB: "${updatedUser1.partStatus}" (Expected: "part-I")`);

    if (updatedUser1.term.toString() === termB._id.toString() && updatedUser1.partStatus === "part-I") {
      console.log("✓ VERIFIED: Student 1 (Failed Part-I) automatically reset to 'part-I' on new term registration!");
    } else {
      console.log("❌ FAILED: Student 1 did not reset correctly.");
    }

    console.log("\n--- Executing updateStudentData for Student 2 (Failed Part-II) to New Term B ---");
    const res2 = await callUpdateStudent(student2._id, {
      registrationNumber: student2.registrationNumber,
      studentName: student2.name,
      term: termB._id.toString(),
      program: progSE._id.toString(),
      department: dept._id.toString()
    });

    console.log(`Response Status: ${res2.status}`);
    const updatedUser2 = await GenUser.findById(student2._id);
    console.log(`Updated Student 2 state in DB:`);
    console.log(`- Term in DB: ${updatedUser2.term} (Expected New Term: ${termB._id})`);
    console.log(`- PartStatus in DB: "${updatedUser2.partStatus}" (Expected: "part-I")`);

    if (updatedUser2.term.toString() === termB._id.toString() && updatedUser2.partStatus === "part-I") {
      console.log("✓ VERIFIED: Student 2 (Failed Part-II) automatically reset to 'part-I' on new term registration!");
    } else {
      console.log("❌ FAILED: Student 2 did not reset correctly.");
    }

    // Clean up
    await GenUser.deleteMany({ _id: { $in: [student1._id, student2._id] } });
    await FYPTerm.deleteMany({ _id: { $in: [termA._id, termB._id] } });
    console.log("\nCleanup completed.");
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");

  } catch (error) {
    console.error("Test failed with error:", error);
    await mongoose.disconnect();
  }
}

run();
