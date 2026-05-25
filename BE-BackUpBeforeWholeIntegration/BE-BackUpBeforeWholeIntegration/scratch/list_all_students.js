const mongoose = require("mongoose");
const GenUser = require("../server/models/AdminModels/GenUserModel");
require("../server/models/AdminModels/program");

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("Connected to database MIS");

    const students = await GenUser.find({ role: "Student" }).populate("program");
    console.log("\n=== ALL STUDENTS ===");
    for (const s of students) {
      console.log(`ID: ${s._id}`);
      console.log(`  Name: ${s.name}`);
      console.log(`  Reg No: ${s.registrationNumber}`);
      console.log(`  Program: ${s.program?.programTitle} (${s.program?._id})`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
