const mongoose = require("mongoose");
require("dotenv").config();
const GenUser = require("./server/models/AdminModels/GenUserModel");

const fixRole = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        const result = await GenUser.updateOne(
            { email: "coordinator@test.com" },
            { $set: { role: "coordinator" } }
        );

        console.log("Update result:", result);
        console.log("Fixed Coordinator role to lowercase 'coordinator'");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error fixing role:", error);
    }
};

fixRole();
