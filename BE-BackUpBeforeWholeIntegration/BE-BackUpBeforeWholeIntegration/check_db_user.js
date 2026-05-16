const mongoose = require("mongoose");
const GenUser = require("./server/models/AdminModels/GenUserModel");
require("dotenv").config();

const checkUser = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/MIS");
        console.log("Connected to DB");

        const user = await GenUser.findOne({ email: "coordinator@test.com" });
        if (user) {
            console.log("✅ User Found:", user.email);
            console.log("   Role:", user.role);
            console.log("   ID:", user._id);
        } else {
            console.log("❌ User NOT Found");
        }

        const allUsers = await GenUser.find({});
        console.log(`\nTotal Users in DB: ${allUsers.length}`);
        allUsers.forEach(u => console.log(` - ${u.email} (${u.role})`));

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
};

checkUser();
