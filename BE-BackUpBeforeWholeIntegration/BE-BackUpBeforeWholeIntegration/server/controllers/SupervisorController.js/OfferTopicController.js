const Topic = require("../../models/SupervisorModels/SupTopic");
const GenUser = require("../../models/AdminModels/GenUserModel");
const Program = require("../../models/AdminModels/program");
const createTopic = async (req, res) => {
  try {
    const { category, title: topic, description } = req.body.addtopic;
    const { userId } = req.body;
    let userTopics = await Topic.findOne({ uploadedBy: userId });

    if (!userTopics) {
      userTopics = new Topic({ uploadedBy: userId, topics: [] });
    }
    userTopics.topics.push({ topic, category, description });
    await userTopics.save();
    res.status(201).json(userTopics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
const updateTopic = async (req, res) => {
  const { userId } = req.body;
  const { selectedTopic } = req.body;
  const { category, topic, description } = req.body.newTopic;

  console.log(userId, selectedTopic, category, topic, description);

  try {
    const updatedTopic = await Topic.findOneAndUpdate(
      { uploadedBy: userId, "topics._id": selectedTopic },
      {
        $set: {
          "topics.$.category": category,
          "topics.$.topic": topic,
          "topics.$.description": description,
        },
      },
      { new: true }
    );

    if (!updatedTopic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res
      .status(200)
      .json({ message: "Topic updated successfully", topic: updatedTopic });
  } catch (error) {
    console.error("Error updating topic:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// const getAllofFeredTopics = async (req, res) => {
//   try {
//     // console.log("Inside get topics");
//     const topics = await Topic.find();

//     // Merge all topics arrays into a single array
//     const formattedTopics = topics.reduce((acc, topicGroup) => {
//       return [
//         ...acc,
//         ...topicGroup.topics.map((topic) => ({
//           topic: topic.topic,
//           category: topic.category,
//           uploadedBy: topicGroup.uploadedBy,
//         })),
//       ];
//     }, []);

//     // console.log("Checking formattedTopics", formattedTopics);
//     res.json(formattedTopics);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

const getAllofFeredTopics = async (req, res) => {
  try {
    const { programId } = req.query; // Extract program ID from query parameters
    const programObj = await Program.findById(programId);
    const departmentId = programObj ? programObj.department : null;

    const query = { role: "faculty" };
    if (departmentId) {
      query.department = departmentId;
    } else {
      query.program = programId;
    }

    const supervisors = await GenUser.find(query, "_id"); // Find supervisors with matching department/program

    // Get topics uploaded by the matched supervisors
    const topics = await Topic.find({ uploadedBy: { $in: supervisors } });

    // Format the topics
    const formattedTopics = topics.reduce((acc, topicGroup) => {
      return [
        ...acc,
        ...topicGroup.topics.map((topic) => ({
          topic: topic.topic,
          category: topic.category,
          uploadedBy: topicGroup.uploadedBy,
        })),
      ];
    }, []);

    res.json(formattedTopics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
const getAllofFeredTopicsByDep = async (req, res) => {
  try {
    const { departmentId } = req.query; // Extract program ID from query parameters
    console.log("Checking Department Id", departmentId);
    const supervisors = await GenUser.find(
      { role: "faculty", department: departmentId },
      "_id"
    ); // Find supervisors with the matching department ID

    // Get topics uploaded by the matched supervisors
    const topics = await Topic.find({ uploadedBy: { $in: supervisors } });

    console.log("Topics", topics);

    // Format the topics
    const formattedTopics = topics.reduce((acc, topicGroup) => {
      return [
        ...acc,
        ...topicGroup.topics.map((topic) => ({
          topic: topic.topic,
          category: topic.category,
          uploadedBy: topicGroup.uploadedBy,
        })),
      ];
    }, []);

    console.log("formatted Topics", formattedTopics);

    res.json(formattedTopics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteTopic = async (req, res) => {
  try {
    const { userId, topicId } = req.body;
    let userTopics = await Topic.findOne({ uploadedBy: userId });

    if (!userTopics) {
      return res.status(404).json({ message: "User topics not found" });
    }

    userTopics.topics = userTopics.topics.filter(
      (topic) => topic._id.toString() !== topicId
    );
    await userTopics.save();
    res.status(200).json(userTopics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createTopic,
  getAllTopics,
  deleteTopic,
  updateTopic,
  getAllofFeredTopics,
  getAllofFeredTopicsByDep,
};
