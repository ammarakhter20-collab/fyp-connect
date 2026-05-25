const xlsx = require("xlsx");
const YourModel = require("../../models/AdminModels/GenUserModel");
const Department = require("../../models/AdminModels/department");
const FYPTerm = require("../../models/AdminModels/fypTerm");
const Program = require("../../models/AdminModels/program");

const importStudent = async (req, res) => {
  console.log("Inside Import User controlerr");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    console.log("Raw JSON data from Excel:", jsonData);

    const users = [];

    for (const item of jsonData) {
      const {
        Name,
        Phone,
        PrimaryEmail,
        SecondaryEmail,
        Password,
        DepartmentName,
        ProgramName,
        Term,
        CNIC,
        Address,
        Role,
        RegNum,
        CrHours,
        CGPA,
        GPA,
      } = item; // Assuming the keys in your Excel file match these fields

      // console.log("Name:", Name);
      // console.log("Mobile:", Phone);
      // console.log("Primary Email:", PrimaryEmail);
      // console.log("Secondary Email:", SecondaryEmail);
      // console.log("Password:", Password);
      // console.log("Department:", DepartmentName);
      // console.log("Program:", ProgramName);
      // console.log("Term:", Term);
      // console.log("CNIC:", CNIC);
      // console.log("Address:", Address);
      // console.log("Role:", Role);
      // console.log("RegNum:", RegNum);
      // console.log("CrHours:", CrHours);
      // console.log("CGPA:", CGPA);
      // console.log("GPA:", GPA);

      const getDepartmentIdByName = async (DepartmentName) => {
        // console.log("Checking Department", DepartmentName);
        const department = await Department.findOne({
          departmentName: DepartmentName,
        });
        return department ? department._id : null;
      };

      // Function to query database for ObjectId of program
      const getProgramIdByName = async (ProgramName) => {
        const program = await Program.findOne({ programTitle: ProgramName });
        return program ? program._id : null;
      };

      // Function to query database for ObjectId of term
      const getTermIdByName = async (Term) => {
        const term = await FYPTerm.findOne({ sessionTerm: Term });
        return term ? term._id : null;
      };

      //   Get ObjectId values for department, program, and term
      const departmentId = await getDepartmentIdByName(DepartmentName);
      const programId = await getProgramIdByName(ProgramName);
      const termId = await getTermIdByName(Term);
      // console.log("Fetched Department ID", departmentId);
      // console.log("Fetched Program ID", programId);
      // console.log("Fetched Term ID", termId);

      // Create a new user object using the fields from the Excel file and the retrieved ObjectId values
      const newUser = new YourModel({
        name: Name,
        phoneNumber: Phone,
        email: PrimaryEmail,
        secondaryEmail: SecondaryEmail,
        password: Password,
        department: departmentId,
        program: programId,
        term: termId,
        cnic: CNIC,
        address: Address,
        role: Role,
        registrationNumber: RegNum,
        creditHours: CrHours,
        cgpa: CGPA,
        gpa: GPA,
      });

      // Save the user to the database
      const savedUser = await newUser.save();
      users.push(savedUser);
    }

    // console.log("Students imported successfully:", users);
    res.json({ message: "Users imported successfully", users });
  } catch (err) {
    res.status(500).json({ message: "Student import failed: " + err.message });
  }
};

const importFaculty = async (req, res) => {
  console.log("Inside Import Faculty controlerr");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    console.log("Raw JSON data from Excel:", jsonData);

    const users = [];

    for (const item of jsonData) {
      const {
        Name,
        Phone,
        PrimaryEmail,
        SecondaryEmail,
        Password,
        DepartmentName,
        ProgramName,
        Term,
        CNIC,
        Address,
        Role,
        facultyId,
        designation,
        extension,
        DoB,
        joiningDate,
      } = item; // Assuming the keys in your Excel file match these fields

      // console.log("Name:", Name);
      // console.log("Mobile:", Phone);
      // console.log("Primary Email:", PrimaryEmail);
      // console.log("Secondary Email:", SecondaryEmail);
      // console.log("Password:", Password);
      // console.log("Department:", DepartmentName);
      // console.log("Program:", ProgramName);
      // console.log("Term:", Term);
      // console.log("CNIC:", CNIC);
      // console.log("Address:", Address);
      // console.log("FacultyID:", facultyId);
      // console.log("Extension:", extension);
      // console.log("Designation:", designation);
      // console.log("dateOfBirth:", DoB);
      // console.log("joiningDate:", joiningDate);

      const getDepartmentIdByName = async (DepartmentName) => {
        // console.log("Checking Department", DepartmentName);
        const department = await Department.findOne({
          departmentName: DepartmentName,
        });
        return department ? department._id : null;
      };

      // Function to query database for ObjectId of program
      const getProgramIdByName = async (ProgramName) => {
        const program = await Program.findOne({ programTitle: ProgramName });
        return program ? program._id : null;
      };

      // Function to query database for ObjectId of term
      const getTermIdByName = async (Term) => {
        const term = await FYPTerm.findOne({ sessionTerm: Term });
        return term ? term._id : null;
      };

      //   Get ObjectId values for department, program, and term
      const departmentId = await getDepartmentIdByName(DepartmentName);
      const programId = await getProgramIdByName(ProgramName);
      const termId = await getTermIdByName(Term);
      // console.log("Fetched Department ID", departmentId);
      // console.log("Fetched Program ID", programId);
      // console.log("Fetched Term ID", termId);

      if (Role && departmentId && (Role.toLowerCase() === "hod" || Role.toLowerCase() === "coordinator")) {
        const existingRoleUser = await YourModel.findOne({
          role: new RegExp(`^${Role}$`, "i"),
          department: departmentId,
        });

        if (existingRoleUser) {
          throw new Error(`A ${Role} for department ${DepartmentName} already exists. Excel import aborted.`);
        }
      }

      // Create a new user object using the fields from the Excel file and the retrieved ObjectId values
      const newUser = new YourModel({
        name: Name,
        phoneNumber: Phone,
        email: PrimaryEmail,
        secondaryEmail: SecondaryEmail,
        password: Password,
        department: departmentId,
        program: programId,
        term: termId,
        cnic: CNIC,
        address: Address,
        role: Role,
        facultyId: facultyId,
        designation,
        extension,
        dateOfBirth: DoB,
        joiningDate,
      });

      // Save the user to the database
      const savedUser = await newUser.save();
      users.push(savedUser);
    }

    // console.log("Faculty imported successfully:", users);
    res.json({ message: "Faculty imported successfully", users });
  } catch (err) {
    res.status(500).json({ message: "Faculty import failed: " + err.message });
  }
};

module.exports = { importStudent, importFaculty };
