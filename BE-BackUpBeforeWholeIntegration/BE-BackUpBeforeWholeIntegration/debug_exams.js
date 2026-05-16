const mongoose = require("mongoose");
require("dotenv").config();

// Models
const GenUser = require("./server/models/AdminModels/GenUserModel");
const FypRegistration = require("./server/models/StudentModels/fypRegModel");
const PanelDetails = require("./server/models/CoordinatorModels/PenalModel");
const Program = require("./server/models/AdminModels/program");
const Department = require("./server/models/AdminModels/department");
const FYPTerm = require("./server/models/AdminModels/fypTerm");

const debugExams = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        // 1. Get Supervisor ID
        const supervisor = await GenUser.findOne({ email: "faculty@test.com" });
        if (!supervisor) {
            console.log("Supervisor not found!");
            return;
        }
        console.log("Supervisor ID:", supervisor._id.toString());
        const userId = supervisor._id.toString();

        // 2. Fetch FYP Registrations (mimicking controller)
        const fypRegistrations = await FypRegistration.find()
            .populate({
                path: "assignedPanel",
                populate: {
                    path: "PanelMembers.member",
                    model: "GenUser",
                },
            })
            .populate("selectedOption")
            .populate("term")
            .populate({
                path: "groupMembers",
                populate: {
                    path: "program",
                    model: "Program",
                },
            });

        console.log(`Found ${fypRegistrations.length} FYP Registrations.`);

        fypRegistrations.forEach((fyp, index) => {
            console.log(`\n--- FYP #${index + 1} ---`);
            console.log(`Topic: ${fyp.topicData?.topic}`);
            console.log(`Supervisor: ${fyp.selectedOption?.name} (${fyp.selectedOption?._id})`);

            if (!fyp.assignedPanel) {
                console.log("Assigned Panel: NULL (Logic will fail here)");
                console.log("Raw assignedPanel value:", fyp.assignedPanel);
            } else {
                console.log(`Assigned Panel: ${fyp.assignedPanel.panelName} (${fyp.assignedPanel._id})`);
                if (fyp.assignedPanel.PanelMembers) {
                    console.log("Panel Members:");
                    fyp.assignedPanel.PanelMembers.forEach(pm => {
                        const memberId = pm.member ? pm.member._id.toString() : "null";
                        const match = memberId === userId ? "MATCH!" : "No match";
                        console.log(` - ${pm.member?.name} (${memberId}) [${match}]`);
                    });
                } else {
                    console.log("PanelMembers array is missing/empty.");
                }
            }
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

debugExams();
