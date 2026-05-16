const mongoose = require("mongoose");
const User = require("../AdminModels/GenUserModel");

const topicSchema = new mongoose.Schema({
  topics: [
    {
      topic: { type: String, required: true },
      category: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
