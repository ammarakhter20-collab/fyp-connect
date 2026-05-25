const multer = require("multer");
const FypRegistration = require("../../models/StudentModels/fypRegModel");
const mongoose = require("mongoose");
const User = require("../../models/AdminModels/GenUserModel");
const FypChangeRequest = require("../../models/SupervisorModels/changeRequest");
const FeedbackCont = require("../../controllers/SupervisorController.js/FeedbackCont");
const FYPTerm = require("../../models/AdminModels/fypTerm");

const createReg = async (req, res) => {
  console.log("Inside Create Reg");
  console.log("Checking uploaded File");
  try {
    // Extract data from the request body
    const {
      groupData,
      selectedOption,
      selectedTechnology,
      topicData,
      selectedPlatform,
      reqStatus,
      user,
      term,
    } = req.body;
    console.log("Checking Group Members Data", groupData);
    console.log("Checking Term", term);

    // FR-78: Supervisor Capacity Enforcement
    const MAX_CAPACITY = 5;
    const activeGroupsCount = await FypRegistration.countDocuments({
      selectedOption: selectedOption, // Supervisor ID
      term: term,
      reqStatus: { $in: ["approved"] } // Count valid active groups
    });

    if (activeGroupsCount >= MAX_CAPACITY) {
      return res.status(400).json({
        success: false,
        message: `Supervisor has reached maximum capacity of ${MAX_CAPACITY} approved groups. Please select another supervisor.`
      });
    }

    // Check if a file was uploaded
    // Check if a file was uploaded
    // let selectedFile = "";
    // if (req.file) {
    //   selectedFile = req.file.path; // Save the file path to attachPdf field
    // }

    // console.log("Checking uploaded File Path", selectedFile);

    // console.log("Group Members", groupData);

    // Create a new FYP registration instance
    const fypRegistration = new FypRegistration({
      groupMembers: groupData,
      selectedOption,
      selectedTechnology,
      // selectedFile,
      topicData,
      selectedPlatform,
      reqStatus,
      user,
      term,
    });

    console.log("Near to save");

    // Save the FYP registration to the database
    await fypRegistration.save();
    console.log("after save");

    // Respond with a success message
    console.log("FypRegistration created successfully:");
    res.status(200).json({ fypRegistration });
  } catch (error) {
    // Handle errors
    console.error("Error creating FYP registration:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create FYP registration",
      error: error.message,
    });
  }
};

const addMember = async (req, res) => {
  console.log("Add Memberrrrrrr funciton calleddddddddddddddddd");
  const { groupId, registrationNumber } = req.body;
  console.log("GroupId", groupId);
  console.log("RegistrationNumber", registrationNumber);

  try {
    // Find the FYP group by ID
    const fypGroup = await FypRegistration.findById(groupId);
    if (!fypGroup) {
      return res
        .status(404)
        .json({ success: false, message: "FYP group not found" });
    }

    // Find the student by registration number
    const student = await User.findOne({ registrationNumber });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Check if the student is already a member of the group
    const isAlreadyMember = fypGroup.groupMembers.some(
      (member) => member.registrationNumber === registrationNumber
    );
    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: "Student is already a member of this group",
      });
    }

    // Add the student to the group members
    fypGroup.groupMembers.push({
      _id: student._id,
      name: student.name,
      phoneNumber: student.phoneNumber,
      email: student.email,
      secondaryEmail: student.secondaryEmail,
      password: student.password,
      department: student.department,
      program: student.program,
      term: student.term,
      cnic: student.cnic,
      address: student.address,
      role: student.role,
      registrationNumber: student.registrationNumber,
      creditHours: student.creditHours,
      cgpa: student.cgpa,
      gpa: student.gpa,
      __v: student.__v,
    });

    // Save the updated FYP group
    await fypGroup.save();

    res.status(200).json({
      success: true,
      message: "Student added to the group successfully",
      fypGroup,
    });
  } catch (error) {
    // Handle errors
    console.error("Error adding member to FYP group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add member to FYP group",
      error: error.message,
    });
  }
};

const deleteMemberOfGroup = async (req, res) => {
  console.log("Delete Member function called");
  const { memberId } = req.body;
  console.log("Member ID:", memberId);

  try {
    // Find the FYP group containing the member to be deleted
    const fypGroup = await FypRegistration.findOne({
      "groupMembers._id": memberId,
    });
    if (!fypGroup) {
      return res
        .status(404)
        .json({ success: false, message: "FYP group not found" });
    }

    // Remove the member from the group members array
    fypGroup.groupMembers.pull({ _id: memberId });

    // Save the updated FYP group
    await fypGroup.save();

    res.status(200).json({
      success: true,
      message: "Member deleted from the group successfully",
      fypGroup,
    });
  } catch (error) {
    // Handle errors
    console.error("Error deleting member from FYP group:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete member from FYP group",
      error: error.message,
    });
  }
};

const updateReg = async (req, res) => {
  console.log("Inside Update Reg");
  try {
    // Extract data from the request body
    const {
      regid,
      groupData,
      selectedOption,
      selectedTechnology,
      topicData,
      selectedPlatform,
      reqStatus,
      user,
      term,
    } = req.body;

    console.log("Reg Id", regid);
    console.log("Group Members", groupData);
    console.log("Supervisor selected", selectedOption);
    console.log("Selected Technology", selectedTechnology);
    console.log("Topic data", topicData);
    console.log("Selected Platform", selectedPlatform);
    console.log("Request status", reqStatus);
    console.log("User", user);
    console.log("Term", term);

    // FR-78: Supervisor Capacity Enforcement (Update)
    if (selectedOption) {
      const MAX_CAPACITY = 5;
      const activeGroupsCount = await FypRegistration.countDocuments({
        selectedOption: selectedOption, // New Supervisor ID
        term: term,
        reqStatus: { $in: ["approved"] }
      });

      if (activeGroupsCount >= MAX_CAPACITY) {
        return res.status(400).json({
          success: false,
          message: `Selected Supervisor has reached maximum capacity of ${MAX_CAPACITY} approved groups.`
        });
      }
    }

    // Extract the registration ID from the request parameters
    const regId = req.body.regid;

    // Find the existing FYP registration data in the database
    const existingReg = await FypRegistration.findById(regId);

    if (!existingReg) {
      return res.status(404).json({
        success: false,
        message: "FYP registration not found",
      });
    }

    // Update the existing FYP registration data with the new values
    existingReg.groupMembers = groupData;
    existingReg.selectedOption = selectedOption;
    existingReg.selectedTechnology = selectedTechnology;
    existingReg.topicData = topicData;
    existingReg.selectedPlatform = selectedPlatform;
    existingReg.reqStatus = reqStatus;
    existingReg.user = user;
    existingReg.term = term;

    // Save the updated FYP registration to the database
    await existingReg.save();

    // Respond with a success message
    console.log("FypRegistration updated successfully:");
    res.status(200).json({ fypRegistration: existingReg });
  } catch (error) {
    // Handle errors
    console.error("Error updating FYP registration:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update FYP registration",
      error: error.message,
    });
  }
};

const updateProjByCoord = async (req, res) => {
  console.log("Inside Update Regggggggggggggggggggggggggggggggg");
  try {
    // Extract data from the request body
    const {
      regid,
      selectedOption,
      selectedTechnology,
      assignedPanel,
      topic,
      selectedPlatform,
      selectedCategory,
      term,
    } = req.body;

    console.log("Reg Id", regid);
    console.log("Supervisor selected", selectedOption);
    console.log("Selected Technology", selectedTechnology);
    console.log("Topic", topic);
    console.log("Selected Platform", selectedPlatform);
    console.log("Selected Category", selectedCategory);
    console.log("Panel", assignedPanel);
    console.log("Term", term);

    // Extract the registration ID from the request parameters
    const regId = req.body.regid;

    // Find the existing FYP registration data in the database
    const existingReg = await FypRegistration.findById(regId);

    if (!existingReg) {
      return res.status(404).json({
        success: false,
        message: "FYP registration not found",
      });
    }

    // Update the existing FYP registration data with the new values
    existingReg.selectedOption = selectedOption;
    existingReg.selectedTechnology = selectedTechnology;
    // existingReg.topicData.topic = topic;
    // existingReg.topicData.category = selectedCategory;
    existingReg.topicData = {
      ...existingReg.topicData,
      topic: topic,
      category: selectedCategory,
    };
    existingReg.selectedPlatform = selectedPlatform;
    existingReg.term = term;
    existingReg.assignedPanel = assignedPanel;

    // Save the updated FYP registration to the database
    await existingReg.save();

    // Respond with a success message
    console.log("FypRegistration updated successfully:");
    res.status(200).json({ fypRegistration: existingReg });
  } catch (error) {
    // Handle errors
    console.error("Error updating FYP registration:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update FYP registration",
      error: error.message,
    });
  }
};

// const getFypData = async (req, res) => {
//   console.log("inside getFYP Data controller");
//   try {
//     const userId = req.user_id;
//     console.log("userId", userId);
//     const userFypRegistrations = await FypRegistration.find({ user: userId })
//       .populate("selectedTechnology")
//       .populate("selectedOption")
//       .populate("selectedPlatform")
//       .populate({
//         path: "groupMembers",
//         populate: [
//           // { path: "user", model: "GenUser" },
//           { path: "department" }, // Populate the 'department' field inside 'groupMembers'
//           { path: "program" }, // Populate the 'program' field inside 'groupMembers'
//           { path: "term" }, // Populate the 'term' field inside 'groupMembers'
//         ],
//       })
//       .populate({
//         path: "selectedOption",
//         populate: [
//           { path: "department" }, // Populate the 'department' field inside 'selectedOption'
//           { path: "program" }, // Populate the 'program' field inside 'selectedOption'
//           { path: "term" }, // Populate the 'term' field inside 'selectedOption'
//         ],
//       });

//     if (!userFypRegistrations || userFypRegistrations.length === 0) {
//       return res.status(404).json({ message: "FYP data not found" });
//     }

//     res.status(200).json({ userFypRegistrations });
//   } catch (error) {
//     console.error("Error fetching user FYP data:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const getFypData = async (req, res) => {
  // console.log("inside getFYP Data controller");
  try {
    // const userRegistrationNumber = req.body.currentUserRegNum;
    const userRegistrationNumber = req.query.registrationNumber; // Extract registration number from query parameters

    // Fetch student's current profile to get their active term
    const studentUser = await User.findOne({ registrationNumber: userRegistrationNumber });
    if (!studentUser) {
      return res.status(404).json({ message: "Student user not found" });
    }

    const query = {
      "groupMembers.registrationNumber": userRegistrationNumber,
    };

    // If the student has an active term, only fetch groups matching that term to prevent duplicate project listings
    if (studentUser.term) {
      query.$or = [
        { term: studentUser.term },
        { term: studentUser.term.toString() }
      ];
    }

    // console.log("Checking registration Number", userRegistrationNumber);
    const userFypRegistrations = await FypRegistration.find(query)
      .populate("selectedTechnology")
      .populate("selectedOption")
      .populate("selectedPlatform")
      .populate({
        path: "groupMembers",
        populate: [
          { path: "department" },
          { path: "program" },
          { path: "term" },
          { path: "PanelDetails" },
        ],
      })
      .populate({
        path: "selectedOption",
        populate: [
          { path: "department" },
          { path: "program" },
          { path: "term" },
        ],
      })
      .populate({
        path: "assignedPanel",
        populate: {
          path: "PanelMembers.member",
          model: "GenUser"
        }
      });

    if (!userFypRegistrations || userFypRegistrations.length === 0) {
      return res.status(404).json({ message: "FYP data not found" });
    }

    res.status(200).json({ FYPDatas: userFypRegistrations });
  } catch (error) {
    console.error("Error fetching user FYP data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllFypReg = async (req, res) => {
  try {
    const allFypRegistrations = await FypRegistration.find()
      .populate("selectedTechnology")
      .populate("selectedOption")
      .populate("selectedPlatform")
      .populate({
        path: "groupMembers",
        populate: [
          { path: "department" },
          { path: "program" },
          { path: "term" },
          { path: "assignedPanel" },
        ],
      })
      .populate({
        path: "selectedOption",
        populate: [
          { path: "department" },
          { path: "program" },
          { path: "term" },
        ],
      })
      .populate({
        path: "term",
      })
      .populate({
        path: "assignedPanel",
      });

    if (!allFypRegistrations || allFypRegistrations.length === 0) {
      return res.status(404).json({ message: "FYP registrations not found" });
    }

    res.status(200).json({ allFypRegistrations });
  } catch (error) {
    console.error("Error fetching all FYP registrations:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const CheckFypStudentExistWhoFillForm = async (req, res) => {
  // console.log("inside Checking user who send fyp form");
  try {
    const userId = req.query.user; // Get the user ID from the query parameters
    // console.log("User ID:", userId);
    // console.log("User ID:", userId);

    // Fetch FYP data based on the user ID
    const userFypRegistrations = await FypRegistration.find({ user: userId });

    if (!userFypRegistrations || userFypRegistrations.length === 0) {
      return res.status(200).json(false);
    }

    res.status(200).json(true);
  } catch (error) {
    console.error("Error fetching user FYP data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const testFyp = async (req, res) => {
  try {
    res.send({ data: "testing fyp resgistfjsdkjfhsdkluhfkds" });
  } catch (error) {
    res.send({ status: false, error: error.message });
  }
};

const getFypRegistrationReq = async (req, res) => {
  const userId = req.params.userid;
  console.log(userId, "here");
  const { filter: Filter } = req.query; // Extract filter from query parameters

  console.log("filter filter", Filter);
  try {
    let fypRequests;
    if (Filter) {
      console.log("inside if", Filter);

      fypRequests = await FypRegistration.find({ reqStatus: Filter })
        .populate("selectedOption")
        .populate({
          path: "groupMembers",
          populate: {
            path: "term",
            model: "FYPTerm", // Assuming FYPTerm is the model for the term
          },
        })
        .exec();
    } else {
      console.log("inside else", Filter);

      fypRequests = await FypRegistration.find({})
        .populate("selectedOption")
        .populate({
          path: "groupMembers",
          populate: {
            path: "term",
            model: "FYPTerm", // Assuming FYPTerm is the model for the term
          },
        })
        .exec();
    }

    const filteredRequests = fypRequests.filter(
      (request) => request.selectedOption && request.selectedOption._id && request.selectedOption._id.toString() === userId
    );
    console.log(`✓ Filtered ${filteredRequests.length} requests for supervisor ${userId}`);
    res.status(200).json({ fypRequests: filteredRequests });
  } catch (error) {
    console.error("Error fetching user FYP data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//{ selectedOption : userId, reqStatus: 'approved' }

const getRegisteredFyps = async (req, res) => {
  const { userid: userId } = req.params;
  try {
    if (userId) {
      const registeredfyps = await FypRegistration.find({
        reqStatus: "approved",
      })
        .populate({ path: "selectedOption", model: "GenUser" })
        .populate({
          path: "groupMembers",
          populate: {
            path: "term",
            model: "FYPTerm", // Assuming FYPTerm is the model for the term
          },
          populate: {
            path: "department",
            model: "Department",
          },
          populate: {
            path: "program",
            model: "Program",
          },
        })
        .populate({ path: "selectedTechnology", model: "Technology" })
        .populate({ path: "selectedPlatform", model: "Platform" })
        .populate({ path: "term", model: "FYPTerm" })
        .populate({ path: "assignedPanel", model: "PanelDetails" })
        .exec();
      //MOST IMP QUERY!!! DON'T Forget
      const filteredFyps = registeredfyps.filter(
        (request) => request.selectedOption._id.toString() === userId
      );

      res.status(200).json({ filteredFyps });
    } else {
      return res.status(404).json({ message: "No Requests found" });
    }

    console.log("user id gettt", userId);
  } catch (error) {
    console.error("Error fetching user FYP data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateFypRequestStatus = async (req, res) => {
  const requestId = req.params.requestid;
  const newStatus = req.body.reqStatus;
  const newFeedback = req.body.reqFeedback;
  console.log("STATUS", newStatus);
  console.log("FEEDBACK", newFeedback);

  console.log("ID receieved", requestId);
  try {
    const existingRequest = await FypRegistration.findById(requestId);
    let updateQuery = { $set: { reqStatus: newStatus } };
    
    if (newStatus === "rejected" && existingRequest && existingRequest.selectedOption) {
      updateQuery.$push = { deniedSupervisors: existingRequest.selectedOption._id || existingRequest.selectedOption };
    }

    const updatedRequest = await FypRegistration.findByIdAndUpdate(
      requestId,
      updateQuery,
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    console.log("UPDATED");
    if (newFeedback) {
      // Call the addFeedback function

      // await addFeedback(requestId, newFeedback);
      await FeedbackCont.AddFeedback(requestId, newFeedback);
    }

    res.status(200).json({ updatedRequest });
  } catch (error) {
    console.error("Error updating request status:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFYPChangeRequestDetails = async (req, res) => {
  const userId = req.params.userid;
  console.log(userId);
  try {
    if (userId) {
      const changeRequests = await FypChangeRequest.find({})
        .populate({
          path: "fypGroup",
          populate: [
            { path: "selectedPlatform", model: "Platform" },
            { path: "selectedTechnology", model: "Technology" },
            { path: "selectedOption", model: "GenUser" },
          ],
        })
        .exec();

      const filteredChangeRequests = changeRequests.filter(
        (request) =>
          request.fypGroup &&
          request.fypGroup.reqStatus.toString() === "approved" &&
          request.fypGroup.selectedOption._id.toString() === userId
      );

      res.status(200).json({ filteredChangeRequests });
    } else {
      return res.status(404).json({ message: "No Change Requests found" });
    }
  } catch (error) {
    console.error("Error fetching change requests:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadChangeRequest = async (req, res) => {
  try {
    // Extract data from request body
    const { fypGroup, changeData, requestedBy } = req.body;

    // Create a new FypChangeRequest document
    const newChangeRequest = new FypChangeRequest({
      fypGroup,
      changeData,
      requestedBy,
    });

    // Save the document to the database
    await newChangeRequest.save();

    res.status(201).json({
      message: "Change request uploaded successfully",
      newChangeRequest,
    });
  } catch (error) {
    console.error("Error uploading change request:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const StudentCount = async (req, res) => {
  console.log("Student Count Called");
  const { deptId } = req.params;

  try {
    const query = { role: { $regex: /^student$/i } };
    if (deptId && deptId !== "undefined" && deptId !== "null" && deptId !== "all") {
      query.department = deptId;
    }
    const studentCount = await User.countDocuments(query);
    console.log("Student Count Calculated:", studentCount);
    res.status(200).json({ studentCount });
  } catch (error) {
    console.error("Error counting students:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const ProjectCount = async (req, res) => {
  console.log("Project Count Called");

  try {
    const projectCount = await FypRegistration.countDocuments({});
    console.log("Project Count Calculated:", projectCount);
    res.status(200).json({ projectCount });
  } catch (error) {
    console.error("Error counting projects:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchStudentsByTerm = async (req, res) => {
  console.log("This function called");
  try {
    const { termId } = req.params; // Extract term ID from request parameters
    console.log("TermId:", termId);

    // Convert termId to ObjectId
    const termObjectId = new mongoose.Types.ObjectId(termId);

    // Find all FYP registrations for the given term
    const fypRegistrations = await FypRegistration.find({ 
      $or: [
        { term: termObjectId },
        { term: termId }
      ]
    })
      .populate({
        path: "groupMembers",
        model: "GenUser",
        select: "_id name registrationNumber", // Include _id to represent studentId
      })
      .exec();

    console.log("FYP Registrations", fypRegistrations);

    if (!fypRegistrations || fypRegistrations.length === 0) {
      return res
        .status(404)
        .json({ error: "No FYP registrations found for the given term." });
    }

    // Extract students from the group members and map to include _id, name, and registrationNumber
    const allStudents = fypRegistrations.flatMap((registration) =>
      registration.groupMembers.map((member) => ({
        studentId: member._id.toString(),
        name: member.name,
        registrationNumber: member.registrationNumber,
      }))
    );

    // Deduplicate students
    const uniqueStudentsMap = new Map();
    for (const student of allStudents) {
      if (!uniqueStudentsMap.has(student.studentId)) {
        uniqueStudentsMap.set(student.studentId, student);
      }
    }
    const students = Array.from(uniqueStudentsMap.values());

    console.log("Students:", students);

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students by term:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteFypRegistrationProject = async (req, res) => {
  const { groupId } = req.params; // Extract groupId from request parameters
  console.log("Inside Delete Whole Project", groupId);

  try {
    // Find the FYP registration by ID and delete it
    const deletedProject = await FypRegistration.findByIdAndDelete(groupId);

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "FYP registration project not found",
      });
    }

    // Respond with success message
    res.status(200).json({
      success: true,
      message: "FYP registration project deleted successfully",
      deletedProject,
    });
  } catch (error) {
    // Handle errors
    console.error("Error deleting FYP registration project:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete FYP registration project",
      error: error.message,
    });
  }
};

const removeStudentFromFypProject = async (req, res) => {
  const { groupId, studentId } = req.params; // Extract groupId and studentId from request parameters
  console.log("Inside Remove Student from FYP Project", groupId, studentId);

  try {
    // Find the FYP registration by groupId
    const fypRegistration = await FypRegistration.findById(groupId);

    if (!fypRegistration) {
      return res.status(404).json({
        success: false,
        message: "FYP registration project not found",
      });
    }

    console.log("Fethed FYP Registration", fypRegistration);

    // Check if the studentId exists in the group members list
    const index = fypRegistration.groupMembers.findIndex(
      (member) => member._id.toString() === studentId
    );
    console.log("Index", index);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Student not found in the FYP registration project",
      });
    }

    // Remove the student from the group members list
    fypRegistration.groupMembers.splice(index, 1);

    // Save the updated FYP registration to the database
    await fypRegistration.save();

    // Respond with success message and the updated FYP registration object
    res.status(200).json({
      success: true,
      message: "Student removed from FYP registration project successfully",
      fypRegistration,
    });
  } catch (error) {
    // Handle errors
    console.error(
      "Error removing student from FYP registration project:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to remove student from FYP registration project",
      error: error.message,
    });
  }
};

const getfypregistrationsbyGroupId = async (req, res) => {
  const { groupId } = req.params;
  console.log("Fetching FYP Registration by Group ID:", groupId);
  try {
    if (groupId) {
      const registeredfyps = await FypRegistration.find({
        _id: groupId,
      })
        .populate({ path: "selectedOption", model: "GenUser" })
        .populate({
          path: "groupMembers",
          populate: [
            { path: "term", model: "FYPTerm" },
            { path: "department", model: "Department" },
            { path: "program", model: "Program" }
          ]
        })
        .populate({ path: "selectedTechnology", model: "Technology" })
        .populate({ path: "selectedPlatform", model: "Platform" })
        .populate({ path: "term", model: "FYPTerm" })
        .populate({ path: "assignedPanel", model: "PanelDetails" })
        .exec();

      // The frontend expects "filteredFyps" structure based on previous patterns, 
      // but let's check what SupPrevSupervisedProj expects.
      // It expects: data.filteredFyps (array)

      res.status(200).json({ filteredFyps: registeredfyps });
    } else {
      return res.status(404).json({ message: "Group ID not provided" });
    }
  } catch (error) {
    console.error("Error fetching FYP data by Group ID:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getfypregistrationsforStudent = async (req, res) => {
  try {
    const { userid } = req.params;
    console.log("getfypregistrationsforStudent called with:", userid);

    // Find FYP Registration where user ID matches creator OR is in group members
    const userFypRegistrations = await FypRegistration.find({
      $or: [
        { user: userid },
        { "groupMembers._id": userid }
      ]
    })
      .populate("selectedTechnology")
      .populate("selectedOption")
      .populate("selectedPlatform")
      .populate({
        path: "groupMembers",
        populate: [
          { path: "department" },
          { path: "program" },
          { path: "term" },
          { path: "PanelDetails" },
        ],
      })
      .populate({
        path: "selectedOption",
        populate: [
          { path: "department" },
          { path: "program" },
          { path: "term" },
        ],
      })
      .populate({
        path: "assignedPanel",
        populate: {
          path: "PanelMembers.member",
          model: "GenUser"
        }
      })
      .populate("term");

    if (!userFypRegistrations || userFypRegistrations.length === 0) {
      return res.status(200).json({ FYPDatas: [] });
    }

    // Deduplicate by Topic and Term to handle redundant registration documents
    const uniqueFyps = [];
    const seen = new Set();
    
    for (const fyp of userFypRegistrations) {
      const identifier = `${fyp.topicData?.topic}-${fyp.term?._id || fyp.term}`;
      if (!seen.has(identifier)) {
        seen.add(identifier);
        uniqueFyps.push(fyp);
      }
    }

    res.status(200).json({ FYPDatas: uniqueFyps });
  } catch (error) {
    console.error("Error fetching student FYP data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createReg,
  getFypData,
  testFyp,
  updateReg,
  CheckFypStudentExistWhoFillForm,
  getAllFypReg,
  uploadChangeRequest,
  getFYPChangeRequestDetails,
  updateFypRequestStatus,
  getRegisteredFyps,
  getFypRegistrationReq,
  addMember,
  deleteMemberOfGroup,
  updateProjByCoord,
  StudentCount,
  ProjectCount,
  fetchStudentsByTerm,
  deleteFypRegistrationProject,
  removeStudentFromFypProject,
  getfypregistrationsbyGroupId,
  getfypregistrationsforStudent,
};
