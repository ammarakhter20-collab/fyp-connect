const mongoose = require("mongoose");
require("dotenv").config();
const GenUser = require("./server/models/AdminModels/GenUserModel");

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        const collection = mongoose.connection.collection("genusers");

        // Check if index exists and drop it
        try {
            await collection.dropIndex("registrationNumber_1");
            console.log("Dropped index: registrationNumber_1");
        } catch (e) {
            console.log("Index registrationNumber_1 might not exist or already dropped:", e.message);
        }

        // Check for other potential duplicate null indexes
        try {
            await collection.dropIndex("phoneNumber_1");
            console.log("Dropped index: phoneNumber_1 (if it existed)");
        } catch (e) {
            // Ignore
        }

        console.log("Index dropped successfully. Mongoose will rebuild it with sparse: true on next app start.");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error fixing indexes:", error);
    }
};

fixIndexes();
