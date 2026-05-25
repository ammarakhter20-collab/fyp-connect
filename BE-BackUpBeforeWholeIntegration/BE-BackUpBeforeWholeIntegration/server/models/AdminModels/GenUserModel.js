const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Department = require("./department");
const FYPTerm = require("./fypTerm");
const Program = require("./program");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    // unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // lowercase: true,
  },

  appPassword: {
    type: String,
    required: false,
  },

  // secondaryEmail: {
  //   type: String,
  //   required: true,
  //   lowercase: true,
  //   // unique: true,
  // },
  secondaryEmail: {
    type: String,
    lowercase: true,
    required: false,
  },
  password: {
    type: String,
    required: true,
    // unique: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: function () {
      return this.role !== "admin"; // Required unless user is admin
    },
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
    required: false,
  },
  term: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FYPTerm",
    required: function () {
      return !(
        this.role === "admin" ||
        this.role === "faculty" ||
        this.role === "coordinator" ||
        this.role === "Coordinator" ||
        this.role === "hod" ||
        this.partStatus === "failed-part-I"
      );
    },
  },
  cnic: {
    type: String,
    // unique: true,
    required: false,
    // function () {
    //   return this.role !== "admin";
  },
  address: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["admin", "hod", "Coordinator", "faculty", "Student", "coordinator"],
    required: true,
  },
  // Student specific fields
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple users to have no registration number (null)
    required: function () {
      return this.role === "Student"; // Make it required only for students
    },
  },

  creditHours: {
    type: Number,
    required: false,
  },
  cgpa: {
    type: Number,
    required: false,
  },
  gpa: {
    type: Number,
    required: false,
  },
  partStatus: {
    type: String,
    default: function () {
      return this.role === "Student" ? "part-I" : undefined; // Set default value to "part-I" for students
    },
    required: function () {
      return this.role === "Student"; // Make it required only for students
    },
  },

  // Faculty specific fields
  facultyId: {
    type: String,
    // unique: true,
    required: false,
    // required: function () {
    //   return ["faculty"].includes(this.role);
    // },
  },
  designation: {
    type: String,
    // required: function () {
    //   return ["hod", "Coordinator", "faculty"].includes(this.role);
    // },
    required: false,
  },
  extension: {
    type: String,
    // unique: true,
    required: false,
    // required: function () {
    //   return ["hod", "Coordinator", "faculty"].includes(this.role);
    // },
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  joiningDate: {
    type: Date,
    required: false,
  },
  image: {
    type: String, // You can store the image URL or file path here
  },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("GenUser", UserSchema);
