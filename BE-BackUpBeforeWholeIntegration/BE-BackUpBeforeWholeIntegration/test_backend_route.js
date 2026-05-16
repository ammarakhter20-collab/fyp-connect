const axios = require("axios");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Models
const GenUser = require("./server/models/AdminModels/GenUserModel");
const CreateExam = require("./server/models/CoordinatorModels/ExamCreationModel");
const FYPReg = require("./server/models/StudentModels/fypRegModel");

const testRoute = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        // 1. Get Supervisor & Token
        const supervisor = await GenUser.findOne({ email: "faculty@test.com" });
        if (!supervisor) throw new Error("Supervisor not found");

        const token = jwt.sign(
            { _id: supervisor._id, role: supervisor.role, email: supervisor.email },
            process.env.TOKEN_KEY || "key", // Fallback if env missing
            { expiresIn: "2h" }
        );
        console.log("Generated Token for Supervisor:", supervisor._id);

        // 2. Get Exam & Term
        const exam = await CreateExam.findOne().populate('Term');
        if (!exam) throw new Error("Exam not found");
        const termId = exam.Term._id.toString();
        const examId = exam._id.toString();

        // 3. Get Group
        const group = await FYPReg.findOne({ "selectedOption": supervisor._id });
        if (!group) throw new Error("Group not found");
        const groupId = group._id.toString();

        // 4. Test Endpoint
        const url = `http://localhost:${process.env.PORT || 5000}/api/manageexampanels/getEvaluationStatofexminer/${termId}/${examId}?groupId=${groupId}&examinerId=${supervisor._id}`;
        console.log("Testing URL:", url);

        try {
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Response Status:", response.status);
            console.log("Response Data:", response.data);
        } catch (err) {
            console.error("Request Failed:");
            if (err.response) {
                console.error(`Status: ${err.response.status}`);
                console.error(`Data:`, err.response.data);
            } else {
                console.error(err.message);
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error("Test Script Error:", error);
    }
};

testRoute();
