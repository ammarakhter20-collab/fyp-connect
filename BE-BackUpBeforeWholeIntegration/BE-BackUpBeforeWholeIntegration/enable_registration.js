const mongoose = require("mongoose");
require("dotenv").config();
const FYPTerm = require("./server/models/AdminModels/fypTerm");
const FYPRegistrationDeadline = require("./server/models/CoordinatorModels/CreateFYPRegModel");

const enableRegistration = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        // 1. Find the Active Term
        const term = await FYPTerm.findOne({ sessionTerm: "Fall-2025" });
        if (!term) {
            console.error("Term 'Fall-2025' not found. Please run create_test_data.js first.");
            process.exit(1);
        }
        console.log("Found Term:", term.sessionTerm);

        // 2. Create Registration Deadline (Open for 30 days)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30); // 30 days from now

        // Check if one already exists
        let deadline = await FYPRegistrationDeadline.findOne({ term: term._id });
        if (deadline) {
            console.log("Registration deadline already exists. Updating date...");
            deadline.dueDateTime = dueDate;
            await deadline.save();
        } else {
            console.log("Creating new Registration deadline...");
            deadline = await FYPRegistrationDeadline.create({
                term: term._id,
                announcementTitle: "Fall 2025 FYP Registration",
                dueDateTime: dueDate,
                instructions: "Please register your FYP team and project details before the deadline."
            });
        }

        console.log("FYP Registration Enabled!");
        console.log(`Due Date: ${dueDate}`);

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error enabling registration:", error);
    }
};

enableRegistration();
