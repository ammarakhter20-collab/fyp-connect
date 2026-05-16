const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const GenUser = require("./server/models/AdminModels/GenUserModel");
require("dotenv").config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        const existingAdmin = await GenUser.findOne({ role: "admin" });
        if (existingAdmin) {
            console.log("Admin already exists:");
            console.log("Email:", existingAdmin.email);
            // We won't reveal the password as it's hashed, but we can reset it if needed.
            // For now, let's just exit or ask the user.
            // But since the user asked for pass, maybe we should create a new one or update the existing one?
            // Let's create a NEW admin if one exists with a different email, or update the existing one.
            // Safest is to create a new default admin if 'admin@test.com' doesn't exist.
        }

        const email = "admin@example.com";
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const filter = { email: email };
        const update = {
            name: "Default Admin",
            email: email,
            password: hashedPassword,
            role: "admin",
            phoneNumber: "0000000000",
            // Add other required fields if any based on schema
        };

        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        const admin = await GenUser.findOneAndUpdate(filter, update, options);

        console.log("Admin User ensured:");
        console.log("Email:", email);
        console.log("Password:", password);

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error creating admin:", error);
    }
};

createAdmin();
