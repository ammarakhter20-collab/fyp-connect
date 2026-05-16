const TaskAssignment = require("../../models/SupervisorModels/TaskAssigmentModel");

// Controller function to create a new task assignment
const createTaskAssignment = async (req, res) => {
  console.log("Inside task assignment controller");
  try {
    const {
      groupId,
      taskTitle,
      taskNo,
      points,
      dueDate,
      dueTime,
      instruction,
    } = req.body;
    console.log("Checking attached file by supervisor", req.file);
    // Check if a file was uploaded
    let attachPdf = "";
    if (req.file) {
      attachPdf = req.file.path; // Save the file path to attachPdf field
    }

    // Create a new task assignment document
    const taskAssignment = new TaskAssignment({
      groupId,
      taskTitle,
      taskNo,
      points,
      dueDate,
      dueTime,
      instruction,
      attachPdf,
    });

    // Save the task assignment to the database
    const savedTaskAssignment = await taskAssignment.save();

    res.status(201).json(savedTaskAssignment);
  } catch (error) {
    console.error("Error creating task assignment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateTaskAssignment = async (req, res) => {
  console.log("Inside update task assignment controller");
  console.log("Inside update task assignment controller");
  console.log("Inside update task assignment controller");
  console.log("Inside update task assignment controller");

  try {
    const taskId = req.params.taskid; // Assuming taskId is passed in the URL

    // Extract fields from the request body
    const { status, SubmittedBy } = req.body;
    console.log(
      "CHecking request file uploaded by std",
      req.files["submitPdf"]
    );
    console.log("CHecking request file uploaded by std", req.files);
    // console.log("Checking request body", req.body);
    console.log("Checking SUbmmited by user Id", SubmittedBy);
    console.log("Checking Task status", status);

    // Extract the submitPdf file path from the request
    let submitPdf = "";
    if (req.files && req.files["submitPdf"]) {
      submitPdf = req.files["submitPdf"][0].path; // Save the file path to submitPdf field
    }

    // Find the task assignment by taskId
    const taskAssignment = await TaskAssignment.findById(taskId);

    if (!taskAssignment) {
      return res.status(404).json({ error: "Task assignment not found" });
    }

    // Update the task assignment fields
    taskAssignment.status = status;
    taskAssignment.SubmittedBy = SubmittedBy;
    // taskAssignment.taskTitle = taskTitle;
    // taskAssignment.taskNo = taskNo;
    // taskAssignment.points = points;
    // taskAssignment.dueDate = dueDate;
    // taskAssignment.dueTime = dueTime;
    // taskAssignment.instruction = instruction;
    taskAssignment.submitPdf = submitPdf || taskAssignment.submitPdf;

    // Save the updated task assignment to the database
    const updatedTaskAssignment = await taskAssignment.save();

    res.status(200).json(updatedTaskAssignment);
  } catch (error) {
    console.error("Error updating task assignment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchAssignedTasks = async (req, res) => {
  console.log("Inside fetch assigned tasks controller");
  try {
    const groupId = req.params.id;
    console.log("CHecking group Id", groupId);

    // Check if groupId is provided
    if (!groupId) {
      return res.status(400).json({ error: "groupId parameter is required" });
    }

    // Retrieve assigned tasks for the specified groupId from the database
    const assignedTasks = await TaskAssignment.find({ groupId });

    res.status(200).json(assignedTasks);
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createTaskAssignment,
  fetchAssignedTasks,
  updateTaskAssignment,
};
