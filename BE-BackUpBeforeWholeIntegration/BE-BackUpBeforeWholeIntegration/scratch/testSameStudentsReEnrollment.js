const mongoose = require("mongoose");
process.env.TOKEN_KEY = "testsecretkey";
const GenUser = require("../server/models/AdminModels/GenUserModel");
const Department = require("../server/models/AdminModels/department");
const Program = require("../server/models/AdminModels/program");
const FYPTerm = require("../server/models/AdminModels/fypTerm");

const { deleteStudent } = require("../server/controllers/AdminCont/GenUserController");
const { createGenUser } = require("../server/controllers/AdminCont/GenUserController");

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("=============================================================");
    console.log("CONNECTED TO DATABASE. Starting Same-Student Re-Registration Test...");
    console.log("=============================================================\n");

    // Seed Departments and Programs
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

    // Seed Term A (old) and Term B (new)
    const termASession = "OLD-TERM-A";
    const termBSession = "NEW-TERM-B";
    
    await FYPTerm.deleteMany({ sessionTerm: { $in: [termASession, termBSession] } });
    
    const termA = new FYPTerm({
      sessionTerm: termASession,
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-01-31"),
      status: "deactivated"
    });
    await termA.save();

    const termB = new FYPTerm({
      sessionTerm: termBSession,
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-06-30"),
      status: "activated"
    });
    await termB.save();

    const testEmail = "same_student_test@example.com";
    const testRegNum = "REG-SAME-FAIL-123";

    // Clean up student from previous runs
    await GenUser.deleteMany({ email: testEmail });
    await GenUser.deleteMany({ registrationNumber: testRegNum });

    console.log("--- STEP 1: Creating Failed Student in Old Term ---");
    const student = new GenUser({
      name: "Same Student Test",
      email: testEmail,
      role: "Student",
      department: dept._id,
      program: progSE._id,
      term: termA._id,
      password: "password123",
      registrationNumber: testRegNum,
      partStatus: "failed-part-I" // Simulating that they failed Part-I previously
    });
    await student.save();
    console.log(`Failed Student seeded: ID=${student._id}, Status=${student.partStatus}, TermID=${student.term}`);

    console.log("\n--- STEP 2: Attempting to Register Same Student as a NEW record in New Term ---");
    console.log("We will try to call the creation controller with the same email and registration number...");

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
      body: {
        name: "Same Student Test Re-creation",
        email: testEmail,
        role: "Student",
        department: dept._id.toString(),
        program: progSE._id.toString(),
        term: termB._id.toString(),
        password: "password123",
        registrationNumber: testRegNum
      }
    };

    await createGenUser(mockReq, mockRes);
    console.log(`Creation Response Status: ${responseStatus}`);
    console.log(`Creation Response Data:`, JSON.stringify(responseData));
    
    if (responseStatus === 400 && responseData.error.includes("duplicate key error")) {
      console.log("\n✓ VERIFIED: Registering them directly as a new record FAILS because they already exist in the system (unique key check).");
    }

    console.log("\n--- STEP 3: OPTION 1 - Re-registration via Cascading Deletion first ---");
    console.log("Deleting the failed student record to clean up all old references...");

    let delStatus = null;
    let delData = null;
    const mockDelRes = {
      status(code) {
        delStatus = code;
        return this;
      },
      json(data) {
        delData = data;
        return this;
      }
    };
    const mockDelReq = {
      body: {
        studentId: student._id.toString()
      }
    };

    await deleteStudent(mockDelReq, mockDelRes);
    console.log(`Delete Response Status: ${delStatus}`);
    
    console.log("Now trying to register them as a new user in the new term again...");
    responseStatus = null;
    responseData = null;
    await createGenUser(mockReq, mockRes);
    console.log(`Creation Response Status: ${responseStatus}`);
    console.log(`Created Student ID: ${responseData?.user?._id}, TermID: ${responseData?.user?.term}`);
    
    if (responseStatus === 200) {
      console.log("✓ VERIFIED: After deleting the old failed record, they are successfully registered in the new term.");
      // Clean up the new user
      await GenUser.deleteOne({ _id: responseData.user._id });
    }

    console.log("\n--- STEP 4: OPTION 2 - Re-registration via Direct Profile Update ---");
    console.log("Re-seeding the failed student record first...");
    const failedStudent = new GenUser({
      name: "Same Student Test",
      email: testEmail,
      role: "Student",
      department: dept._id,
      program: progSE._id,
      term: termA._id,
      password: "password123",
      registrationNumber: testRegNum,
      partStatus: "failed-part-I"
    });
    await failedStudent.save();
    console.log(`Student seeded. Now simulating direct profile update to enroll them in the new term...`);

    // Simulate updateStudentData behaviour for term and status
    const updated = await GenUser.findByIdAndUpdate(
      failedStudent._id,
      {
        $set: {
          term: termB._id,
          partStatus: "part-I"
        }
      },
      { new: true }
    );
    console.log(`Update completed successfully.`);
    console.log(`Updated Student in DB: ID=${updated._id}, Name="${updated.name}", Status="${updated.partStatus}", TermID=${updated.term}`);
    
    if (updated.term.toString() === termB._id.toString() && updated.partStatus === "part-I") {
      console.log("✓ VERIFIED: The existing student is successfully updated and re-enrolled in the new term without database errors.");
    }

    // Cleanup
    await GenUser.deleteMany({ email: testEmail });
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
