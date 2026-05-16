const mongoose = require("mongoose");
require("dotenv").config();
const GenUser = require("./server/models/AdminModels/GenUserModel");
const Technology = require("./server/models/CoordinatorModels/Technology");
const Platform = require("./server/models/CoordinatorModels/PlatformModel");

const seedOptions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        // Get Coordinator
        const coordinator = await GenUser.findOne({ role: "coordinator" }); // Lowercase 'coordinator'
        if (!coordinator) {
            console.error("Coordinator not found! Please ensure test data is generated.");
            process.exit(1);
        }
        console.log("Using Coordinator:", coordinator.email);

        // Seed Technologies
        const technologies = ["React.js", "Node.js", "Python", "Machine Learning", "Flutter", "Angular", "Cyber Security"];
        for (const techName of technologies) {
            const existing = await Technology.findOne({ techName });
            if (!existing) {
                await Technology.create({ techName, user: coordinator._id });
                console.log(`Created Technology: ${techName}`);
            } else {
                console.log(`Technology exists: ${techName}`);
            }
        }

        // Seed Platforms
        const platforms = ["Web Application", "Mobile App", "Desktop Application", "Embedded System", "Research Based"];
        for (const platformName of platforms) {
            const existing = await Platform.findOne({ platformName });
            if (!existing) {
                await Platform.create({ platformName, user: coordinator._id });
                console.log(`Created Platform: ${platformName}`);
            } else {
                console.log(`Platform exists: ${platformName}`);
            }
        }

        console.log("Seeding completed successfully.");
        await mongoose.disconnect();

    } catch (error) {
        console.error("Error seeding options:", error);
    }
};

seedOptions();
