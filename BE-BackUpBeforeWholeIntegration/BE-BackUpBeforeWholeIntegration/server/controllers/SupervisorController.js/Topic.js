const Topic = require("../../models/SupervisorModels/SupTopic");

const addTopic = async (req, res) => {
  // console.log("I am inside add topic cont");
  // console.log("req", req.body);
  const uploadedBy = req.body.uploadedBy;
  const newTopics = req.body.topics;

  try {
    const topic = await Topic.findOne({ uploadedBy });
    if (!topic) {
      const newTopic = new Topic({
        topics: newTopics,
        uploadedBy,
      });
      const savedTopic = await newTopic.save();
      res.status(201).json(savedTopic);
    } else {
      topic.topics.push(...newTopics);
      const updatedTopic = await topic.save();
      res.status(201).json(updatedTopic);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const fetchTopics = async (req, res) => {
  try {
    // Fetch all topics from the database
    const topics = await Topic.find();
    // console.log("Checkint topics ", topics);

    // Send the topics as a response
    res.status(200).json(topics);
  } catch (error) {
    // If an error occurs, send an error response
    res
      .status(500)
      .json({ message: "Failed to fetch topics", error: error.message });
  }
};

module.exports = {
  addTopic,
  fetchTopics,
};
