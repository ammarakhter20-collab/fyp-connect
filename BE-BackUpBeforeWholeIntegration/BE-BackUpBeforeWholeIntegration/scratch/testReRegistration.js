const mongoose = require("mongoose");
const GenUser = require("../server/models/AdminModels/GenUserModel");
const Department = require("../server/models/AdminModels/department");
const Program = require("../server/models/AdminModels/program");
const FYPTerm = require("../server/models/AdminModels/fypTerm");

const { deleteStudent } = require("../server/controllers/AdminCont/GenUserController");

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("Connected to MongoDB successfully.\n");

    // Fetch baseline data (department, program, term)
    const db = mongoose.connection.db;
    const term = await FYPTerm.findOne({});
    const dept = await Department.findOne({});
    const prog = await Program.findOne({});

    if (!term || !dept || !prog) {
      console.error("Missing baseline DB records (term, department, or program). Please seed the DB first.");
      process.exit(1);
    }

    const testEmail = "failstudent_test@example.com";
    const testRegNum = "TEST-REG-FAIL-99";

    // Clean up any leftovers first
    await GenUser.deleteMany({ email: testEmail });
    await GenUser.deleteMany({ registrationNumber: testRegNum });

    console.log("--- STEP 1: Registering Student for the First Time ---");
    const student = new GenUser({
      name: "Test Fail Student",
      email: testEmail,
      role: "Student",
      department: dept._id,
      program: prog._id,
      term: term._id,
      password: "password123",
      registrationNumber: testRegNum,
      partStatus: "part-I"
    });

    await student.save();
    console.log(`Student registered successfully: ID=${student._id}, Status=${student.partStatus}, Term=${student.term}`);

    console.log("\n--- STEP 2: Simulating Failure in Part-I ---");
    // Simulate failing the student (similar to TermContinuationController logic)
    await GenUser.findByIdAndUpdate(student._id, {
      $set: {
        partStatus: "failed-part-I",
        term: null
      }
    });

    const failedStudent = await GenUser.findById(student._id);
    console.log(`Updated Student in DB: ID=${failedStudent._id}, Status=${failedStudent.partStatus}, Term=${failedStudent.term}`);

    console.log("\n--- STEP 3: Attempting to Re-register the Student (Without Deletion) ---");
    console.log("We will try to register a new student record with the same email and registration number...");

    try {
      const duplicateStudent = new GenUser({
        name: "Test Fail Student Re-registered",
        email: testEmail,
        role: "Student",
        department: dept._id,
        program: prog._id,
        term: term._id,
        password: "password123",
        registrationNumber: testRegNum,
        partStatus: "part-I"
      });
      await duplicateStudent.save();
      console.log("SUCCESS: Unexpectedly registered duplicate user!");
    } catch (err) {
      console.log(`EXPECTED FAILURE: Could not save duplicate user record.`);
      console.log(`Error Message: ${err.message}`);
    }

    console.log("\n--- STEP 4: Deleting the Failed Student (Cascading Delete) ---");
    // Mock the Express res object
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
        studentId: student._id.toString()
      }
    };

    await deleteStudent(mockReq, mockRes);
    console.log(`Delete Response Status: ${responseStatus}`);
    console.log(`Delete Response Data:`, JSON.stringify(responseData));

    // Confirm student is deleted
    const studentCheck = await GenUser.findById(student._id);
    console.log(`Student in DB after deletion: ${studentCheck ? "Exists" : "Does NOT exist (Deleted successfully)"}`);

    console.log("\n--- STEP 5: Registering the Student Again (After Deletion) ---");
    const reRegisteredStudent = new GenUser({
      name: "Test Fail Student Re-registered",
      email: testEmail,
      role: "Student",
      department: dept._id,
      program: prog._id,
      term: term._id,
      password: "password123",
      registrationNumber: testRegNum,
      partStatus: "part-I"
    });

    await reRegisteredStudent.save();
    console.log(`Student re-registered successfully: ID=${reRegisteredStudent._id}, Status=${reRegisteredStudent.partStatus}, Term=${reRegisteredStudent.term}`);

    // Cleanup
    await GenUser.deleteOne({ _id: reRegisteredStudent._id });
    console.log("\nCleanup: Deleted test re-registered student record.");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Test failed with error:", error);
    await mongoose.disconnect();
  }
}

run();
