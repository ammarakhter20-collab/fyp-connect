const GenUser = require("../../models/AdminModels/GenUserModel");
const Program = require("../../models/AdminModels/program");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Cascading deletion dependent models
const FypRegistration = require("../../models/StudentModels/fypRegModel");
const FYPGroupAttendance = require("../../models/SupervisorModels/FYPAttendanceModel");
const ExamMarks = require("../../models/SupervisorModels/examMarksAssignment");
const TaskAssignment = require("../../models/SupervisorModels/TaskAssigmentModel");
const StudentReport = require("../../models/CoordinatorModels/StudentReportsModel");
const FYPTopicChangeRequest = require("../../models/StudentModels/TopicReqModel");
const FYPTechnologyChangeRequest = require("../../models/StudentModels/TechReqModel");
const FypChangeRequest = require("../../models/SupervisorModels/changeRequest");
const Feedback = require("../../models/SupervisorModels/FeedbackModel");
const Evaluation = require("../../models/CoordinatorModels/EvaluateExamModel");
const Result = require("../../models/CoordinatorModels/ResultsModel");
const Timetable = require("../../models/StudentModels/StdTimetableModel");
const ExamAssignment = require("../../models/CoordinatorModels/ExamAssignment");

// Use environment variable directly or load from a configuration file
const secretKey = process.env.TOKEN_KEY;

const createGenUser = async (req, res) => {
  console.log("Inside GenUserController");

  const {
    name,
    phoneNumber,
    email,
    secondaryEmail,
    password,
    department,
    program,
    term,
    cnic,
    address,
    role,
    registrationNumber,
    creditHours,
    cgpa,
    gpa,
    // partStatus,
    facultyId,
    designation,
    extension,
    dateOfBirth,
    joiningDate,
  } = req.body;

  console.log("name", name);
  console.log("pn", phoneNumber);
  console.log("e", email);
  console.log("password", password);
  console.log("department", department);
  console.log("Role = ", role);
  // console.log("program", program);
  // console.log("Checking part Status", partStatus);
  console.log("term", term);
  console.log("cnic", cnic);
  console.log("role", role);
  console.log("facultyId", facultyId);
  console.log("designation", designation);
  console.log("extension", extension);
  console.log("dob", dateOfBirth);
  console.log("joininDate", joiningDate);

  try {
    if (role && department && (role.toLowerCase() === "hod" || role.toLowerCase() === "coordinator")) {
      const existingRoleUser = await GenUser.findOne({
        role: new RegExp(`^${role}$`, "i"),
        department: department,
      });

      if (existingRoleUser) {
        return res.status(400).json({
          error: `A ${role} for this department already exists.`,
        });
      }
    }

    const user = await GenUser.create({
      facultyId,
      name,
      role,
      phoneNumber,
      designation,
      program,
      department,
      term,
      extension,
      dateOfBirth,
      joiningDate,
      email,
      secondaryEmail,
      password,
      cnic,
      address,
      registrationNumber,
      creditHours,
      cgpa,
      gpa,
    });

    console.log("Sending to the model");

    // Generate token upon successful registration
    const token = jwt.sign({ user_id: user._id }, secretKey, {
      expiresIn: "1h",
    });

    console.log("User registered successfully:", user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const fetchStudentsData = async (req, res) => {
  // console.log("Insid Fetch Student Data");
  try {
    const students = await GenUser.find({ role: { $regex: /^student$/i } })
      .populate("department")
      .populate("program")
      .populate("term");

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    // Return the list of students with populated fields
    res.status(200).json({ students });
    // console.log("Respond correctly");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const CheckStudentExistInOtherActTerm = async (req, res) => {
  console.log("Checking existence function called");
  try {
    const { registrationNumber } = req.query;
    // console.log("Checking Term Id", termId);
    console.log("Checking reg", registrationNumber);

    // Check if a student with the specified term ID and registration number exists
    const student = await GenUser.findOne({
      // role: "student",
      // "term._id": termId,
      registrationNumber: registrationNumber,
    });

    console.log("Studentttttt", student);

    if (student) {
      console.log("Yes already existssssss");
      // If a student is found with the given term ID and registration number, return true
      res.status(200).json({ exists: true });
    } else {
      // If no student is found, return false
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    // Handle any errors
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ... (skip lines) ... // Note: This comment is just for prompt clarity, not invalid code. I'll omit it in actual replacement.

// The multi-replace tool is better for non-contiguous edits, but since I am using replace_file_content, I must include the text between.
// However, the text between is HUGE (400 lines). I should likely use multi_replace or two separate replace calls.
// The previous attempt failed because I tried to bridge a large gap.
// Let's split this into two separate `replace_file_content` calls or use `multi_replace_file_content`.
// I will use `multi_replace_file_content`.


// const fetchFacultyData = async (req, res) => {
//   console.log("Called");
//   console.log("Called");
//   console.log("Called");
//   console.log("Called");
//   try {
//     const faculties = await GenUser.find({
//       role: { $in: ["hod", "coordinator", "faculty"] },
//     })
//       .populate("department")
//       .populate("program")
//       .populate("term");

//     if (!faculties || faculties.length === 0) {
//       return res.status(404).json({ message: "No faculties found" });
//     }

//     // Return the list of faculties with populated fields
//     res.status(200).json({ faculties });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const fetchFacultyData = async (req, res) => {
  console.log("Checking Checking checking");
  const userId = req.params.userid;

  if (userId) {
    try {
      const faculties = await GenUser.findOne({
        _id: userId,
        role: { $regex: /^(hod|coordinator|faculty)$/i },
      })
        .populate("department")
        .populate("program");

      if (!faculties) {
        return res.status(404).json({ message: "Faculty not found" });
      }

      res.status(200).json({ faculties });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Return array of all faculty members
    try {
      console.log("user id not exist else running");
      const faculties = await GenUser.find({
        role: { $regex: /^(hod|coordinator|faculty)$/i },
      })
        .populate("department")
        .populate("program");

      if (!faculties || faculties.length === 0) {
        return res.status(404).json({ message: "No faculties found" });
      }

      // Return the list of faculties with populated fields
      res.status(200).json({ faculties });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const fetchStudentCount = async (req, res) => {
  console.log("Fetch student called ");
  try {
    const studentCount = await GenUser.countDocuments({ role: "student" });

    // Return the student count
    res.status(200).json({ count: studentCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchAdminData = async (req, res) => {
  try {
    const admin = await GenUser.findOne({ role: "admin" })
      .populate("department")
      .populate("program");

    if (!admin) {
      return res.status(404).json({ message: "No Admin found" });
    }

    // Construct the admin object with desired properties
    const adminObject = {
      _id: admin._id,
      name: admin.name,
      phoneNumber: admin.phoneNumber,
      email: admin.email,
      // Add other properties as needed
      role: admin.role,
    };

    // Send the admin object in the response
    res.status(200).json({ admin: adminObject });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateStudentData = async (req, res) => {
  console.log("Inside student update controller");
  const { studentId } = req.body; // Extract studentId from req body
  const {
    registrationNumber,
    studentName,
    phoneNumber,
    creditHours,
    cgpa,
    gpa,
    email,
    secondaryEmail,
    password,
    cnic,
    address,
    department,
    program,
    term,
    partStatus,
  } = req.body;

  try {
    // Build the update object
    const updateFields = {
      registrationNumber,
      name: studentName,
      phoneNumber,
      creditHours,
      cgpa,
      gpa,
      email,
      secondaryEmail,
      cnic,
      address,
      department,
      program,
      term,
    };

    if (partStatus !== undefined) {
      updateFields.partStatus = partStatus;
    }

    // Auto-reset failed/part-II status to 'part-I' if term is being changed/updated
    const existingUser = await GenUser.findById(studentId);
    if (existingUser) {
      const currentTermId = existingUser.term ? existingUser.term.toString() : null;
      const newTermId = term ? term.toString() : null;

      // If registered in a different term (e.g. re-registering for a new term, or from null to a term)
      if (newTermId && currentTermId !== newTermId) {
        if (existingUser.partStatus === "failed-part-I" || existingUser.partStatus === "part-II") {
          updateFields.partStatus = "part-I";
        }
      }
    }

    // If password is provided, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt();
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Find the student by ID and update its data
    const updatedStudent = await GenUser.findByIdAndUpdate(
      studentId,
      updateFields,
      { new: true } // Return the updated document
    )
      .populate("department")
      .populate("program")
      .populate("term");

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found." });
    }

    console.log("Student updated successfully:", updatedStudent._id);
    res.status(200).json({ updatedStudent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateFacultyData = async (req, res) => {
  console.log("Inside faculty update controller");
  const { facId } = req.body; // Extract facultyId from req body
  const {
    facultyId,
    name,
    role,
    phoneNumber,
    designation,
    email,
    secondaryEmail,
    password,
    cnic,
    address,
    department,
    program,
    // term,
    extension,
    dateOfBirth,
    joiningDate,
  } = req.body;

  try {
    if (role && department && (role.toLowerCase() === "hod" || role.toLowerCase() === "coordinator")) {
      const existingRoleUser = await GenUser.findOne({
        _id: { $ne: facId },
        role: new RegExp(`^${role}$`, "i"),
        department: department,
      });

      if (existingRoleUser) {
        return res.status(400).json({
          error: `A ${role} for this department already exists.`,
        });
      }
    }

    // Build the update object
    const updateFields = {
      facultyId,
      name,
      role,
      phoneNumber,
      email,
      secondaryEmail,
      cnic,
      address,
      department,
      program,
      // term,
      designation,
      extension,
      dateOfBirth,
      joiningDate,
    };

    // If password is provided, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt();
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Find the faculty member by ID and update their data
    const updatedFaculty = await GenUser.findByIdAndUpdate(
      facId,
      updateFields,
      { new: true } // Return the updated document
    )
      .populate("department")
      .populate("program");
    if (!updatedFaculty) {
      return res.status(404).json({ message: "Faculty member not found." });
    }

    console.log("Faculty member updated successfully:", updatedFaculty._id);
    res.status(200).json({ updatedFaculty });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  console.log("Inside deleteStudent");
  try {
    console.log("Check id passed in body", req.body.studentId);
    const studentId = req.body.studentId; // Extract studentId from request body
    console.log("Checking id in variable ", studentId);

    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid Student ID." });
    }

    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    // 1. Find all FypRegistration groups where the student is a member
    const groups = await FypRegistration.find({ "groupMembers._id": studentObjectId });
    console.log(`Found ${groups.length} groups containing student ${studentId}`);

    for (const group of groups) {
      const groupId = group._id;
      // Filter out the student from groupMembers array
      const initialMemberCount = group.groupMembers.length;
      const updatedMembers = group.groupMembers.filter(
        (m) => m._id.toString() !== studentObjectId.toString()
      );

      if (updatedMembers.length === 0) {
        // Group becomes empty: delete group and all group-dependent data
        console.log(`Group ${groupId} became empty. Performing cascading group deletion.`);

        await FYPGroupAttendance.deleteMany({ fypgroup: groupId });
        await ExamMarks.deleteMany({ groupId: groupId });
        await TaskAssignment.deleteMany({ groupId: groupId });
        await StudentReport.deleteMany({ FYPGroup: groupId });
        await FYPTopicChangeRequest.deleteMany({ groupId: groupId });
        await FYPTechnologyChangeRequest.deleteMany({ groupId: groupId });
        await FypChangeRequest.deleteMany({ fypGroup: groupId });
        await Feedback.deleteMany({ groupId: groupId });
        await ExamAssignment.deleteMany({ groupId: groupId });

        // Pull group from Evaluation
        await Evaluation.updateMany(
          { "terms.exams.fypGroups.groupId": groupId },
          { $pull: { "terms.$[].exams.$[].fypGroups": { groupId: groupId } } }
        );

        // Delete the group itself
        await FypRegistration.findByIdAndDelete(groupId);
      } else {
        // Group has other members: update groupMembers and shift exam submitBy if necessary
        console.log(`Group ${groupId} still has other members. Updating group.`);
        
        // If the deleted student was the submitBy on ExamAssignment, reassign to next member
        const nextSubmitterId = updatedMembers[0]._id;
        await ExamAssignment.updateMany(
          { groupId: groupId, submitBy: studentObjectId },
          { $set: { submitBy: nextSubmitterId } }
        );

        group.groupMembers = updatedMembers;
        await group.save();
      }
    }

    // 2. Perform direct student record cleanup
    // Timetable
    await Timetable.deleteMany({ user: studentObjectId });

    // Direct Student Reports
    await StudentReport.deleteMany({ uploadedBy: studentObjectId });

    // Topic Change Requests
    await FYPTopicChangeRequest.deleteMany({ user: studentObjectId });

    // Technology Change Requests
    await FYPTechnologyChangeRequest.deleteMany({ user: studentObjectId });

    // Supervisor Change Requests
    await FypChangeRequest.deleteMany({ requestedBy: studentObjectId });

    // Reset TaskAssignment submissions
    await TaskAssignment.updateMany(
      { SubmittedBy: studentObjectId },
      { $unset: { SubmittedBy: "" }, $set: { status: "pending", submitPdf: "" } }
    );

    // Attendance
    await FYPGroupAttendance.updateMany(
      { "partStatus.meetings.memberAttendances.member": studentObjectId },
      { $pull: { "partStatus.$[].meetings.$[].memberAttendances": { member: studentObjectId } } }
    );

    // Exam marks
    await ExamMarks.updateMany(
      { "examiners.marks.student": studentObjectId },
      { $pull: { "examiners.$[].marks": { student: studentObjectId } } }
    );

    // Evaluation
    await Evaluation.updateMany(
      { "terms.exams.fypGroups.students.studentId": studentObjectId },
      { $pull: { "terms.$[].exams.$[].fypGroups.$[].students": { studentId: studentObjectId } } }
    );

    // Result
    await Result.updateMany(
      { "terms.students.studentId": studentObjectId },
      { $pull: { "terms.$[].students": { studentId: studentObjectId } } }
    );

    // 3. Finally, delete the student itself
    const deletedStudent = await GenUser.findByIdAndDelete(studentObjectId);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found." });
    }

    console.log("Student deleted successfully:", deletedStudent._id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error in deleteStudent controller:", error);
    res.status(400).json({ error: error.message });
  }
};

const deleteFaculty = async (req, res) => {
  console.log("Inside deleteStudent");
  try {
    console.log("Check id passed in body", req.body.studentId);
    const facId = req.body.facId; // Extract studentId from request body
    console.log("Checking id in variable ", facId);
    // console.log("Student id inside delete", studentId);
    const deletedFaculty = await GenUser.findByIdAndDelete(facId);

    if (!deletedFaculty) {
      return res.status(404).json({ message: "Faculty not found." });
    }

    console.log("Faculty deleted successfully:", deletedFaculty._id);
    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginGenUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Generalllllllllll Login request received:", {
      email,
      password,
    });

    const user = await GenUser.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token upon successful login
    const token = jwt.sign({ user_id: user._id }, secretKey, {
      expiresIn: "1h",
    });

    // console.log("General user Login successful!");
    // console.log(token);
    res.status(200).json({ user, token });
  } catch (error) {
    // console.error("Genera User Login error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  console.log("I am inside user profile");
  console.log("UpdateUserProfile function");
  const { name, email, secondaryEmail, phoneNumber, address } = req.body; // Extract necessary fields from req body
  console.log("request", req.body);
  const { user, ...formData } = req.body;
  console.log("formData", formData);

  try {
    // Construct updateFields object with the fields to be updated
    // const updateFields = {};
    // if (name) updateFields.name = name;
    // if (email) updateFields.email = email;
    // if (secondaryEmail) updateFields.secondaryEmail = secondaryEmail;
    // if (phoneNumber) updateFields.phoneNumber = phoneNumber;
    // if (address) updateFields.address = address;

    let updatedUser;

    updatedUser = await GenUser.findByIdAndUpdate(
      user,
      { $set: formData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    console.log("Successfull");

    // Return the updated user
    res.status(200).json({ updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getGenUserData = async (req, res) => {
  // console.log("I am inside getGenUserData");
  try {
    const user = await GenUser.findById(req.user_id)
      .populate("department")
      .populate("program")
      .populate("term");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user-specific data
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const GentestUser = async (req, res) => {
  try {
    res.send({ status: true, data: "secret data!!!!" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchCoordinatorIds = async (req, res) => {
  console.log("Inside fetch CoordinatorID");
  try {
    // const coordinatorIds = await GenUser.find({ role: "coordinator" }, "_id");
    const coordinatorIds = await GenUser.find(
      { $or: [{ role: "coordinator" }, { role: "Coordinator" }] },
      "_id"
    );

    res.status(200).json({ coordinatorIds });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllStudentsOfTermAndProgram = async (req, res) => {
  console.log("Inside getAllStudentsOfTermAndProgram");
  try {
    const { termId, programId } = req.query;

    console.log("Term ID:", termId);
    console.log("Program ID:", programId);

    // Fetch students based on term and program
    const students = await GenUser.find({
      role: { $regex: /^student$/i },
      term: termId,
      program: programId,
    })
      .populate("department")
      .populate("program")
      .populate("term");

    if (!students || students.length === 0) {
      return res.status(404).json({
        message: "No students found for the specified term and program",
      });
    }

    // Return the list of students with populated fields
    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchFacultyOfProgram = async (req, res) => {
  console.log("Inside fetchFacultyOfProgram");
  try {
    const { programId } = req.query;

    console.log("Program ID:", programId);

    const programObj = await Program.findById(programId);
    const departmentId = programObj ? programObj.department : null;

    const query = { role: { $regex: /^faculty$/i } };
    if (departmentId) {
      query.department = departmentId;
    } else {
      query.program = programId;
    }

    // Fetch faculty members based on department of program
    const facultyMembers = await GenUser.find(query)
      .populate("department")
      .populate("program");

    if (!facultyMembers || facultyMembers.length === 0) {
      return res.status(404).json({
        message: "No faculty members found for the specified program",
      });
    }

    // Return the list of faculty members with populated fields
    res.status(200).json({ facultyMembers });
  } catch (error) {
    console.error("Error fetching faculty members data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkUserExist = async (req, res) => {
  console.log("CHeck User Existence Calleddddddddddddddddddd");
  try {
    const { email, role } = req.body;
    console.log("Checking Mail", email);

    const user = await GenUser.findOne({ email });
    console.log("Userrrrrrrrrrrrr", user);
    if (user) {
      // If a user is found with the given email, return true
      return res.status(200).json({ exists: true });
    } else {
      // If no user is found, return false
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    // Handle any errors
    console.error("Error checking user existence:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchCoordinatorByDepartment = async (req, res) => {
  console.log("Inside fetchCoordinatorByDepartment");
  console.log("Inside fetchCoordinatorByDepartment");
  console.log("Inside fetchCoordinatorByDepartment");
  try {
    const { departmentId } = req.params; // Get departmentId from request parameters

    // Build the query object
    const query = { role: "coordinator", department: departmentId };

    const coordinators = await GenUser.find(query).populate("department");

    if (!coordinators || coordinators.length === 0) {
      return res.status(404).json({
        message: "No Coordinators found for the specified department",
      });
    }

    // Return the list of coordinators with populated department fields
    res.status(200).json({ coordinators });
  } catch (error) {
    console.error("Error fetching coordinators data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createGenUser,
  loginGenUser,
  getGenUserData,
  GentestUser,
  fetchStudentsData,
  updateStudentData,
  deleteStudent,
  fetchAdminData,
  fetchStudentCount,
  fetchFacultyData,
  updateFacultyData,
  deleteFaculty,
  updateUserProfile,
  fetchCoordinatorIds,
  CheckStudentExistInOtherActTerm,
  getAllStudentsOfTermAndProgram,
  fetchFacultyOfProgram,
  checkUserExist,
  fetchCoordinatorByDepartment,
};
