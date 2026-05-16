const mongoose = require("mongoose");
require("dotenv").config();
const GenUser = require("./server/models/AdminModels/GenUserModel");

const getSupervisorId = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        const supervisor = await GenUser.findOne({ email: "faculty@test.com" });
        if (supervisor) {
            console.log("Supervisor Found");
            const fs = require('fs');
            fs.writeFileSync('supervisor_id.txt', supervisor._id.toString());
        } else {
            console.log("Supervisor not found.");
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

getSupervisorId();
