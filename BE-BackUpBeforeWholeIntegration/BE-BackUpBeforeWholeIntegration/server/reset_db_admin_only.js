const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const GenUser = require("./models/AdminModels/GenUserModel");
require("dotenv").config();

// List of collections to TRUNCATE (Delete All)
const TRANSACT_COLLECTIONS = [
    "fypregistrations",
    "topicreqs",
    "techreqs",
    "stdtimetables",
    "suptopics",
    "changerequests",
    "studentreports",
    "marks",
    "results",
    "exammarksassignments",
    "evaluateexams",
    "examassignments",
    "examschedules",
    "examcreations",
    "penals",
    "coordannouncements",
    "announcements",
    "taskassigns",
    "feedbacks",
    "fypattendances",
    "createfypregs",
    "managepercentages",
    "cloforexams",
    "quesforclos",
    "excelusers",
    "fypterms",
    "fypsessionterms",
    "departments",
    "programs",
    "coursecats",
    "examtypes",
    "technologies",
    "platforms",
    "clos",
    "addcats",
    "notifications"
];

// List of configuration collections to KEEP (Do nothing, or maybe clean up orphans?)
// We will KEEP these to ensure the Admin Panel has dropdown contents.
// departments, programs, fypterms, coursecats, examtypes, technologies, clos, platforms, addcats

const resetDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        // 1. Clean Transactional Collections
        for (const colName of TRANSACT_COLLECTIONS) {
            try {
                // Check if collection exists before attempting delete
                // Mongoose doesn't throw if it doesn't exist, but good to know
                const count = await mongoose.connection.db.collection(colName).countDocuments();
                if (count > 0) {
                    await mongoose.connection.db.collection(colName).deleteMany({});
                    console.log(`❌ Deleted ${count} documents from '${colName}'`);
                } else {
                    // console.log(`(Empty) '${colName}'`);
                }
            } catch (e) {
                console.log(`⚠️ Error clearing '${colName}': ${e.message}`);
            }
        }

        // 2. Clean Users (Keep Admin Only)
        const initialUserCount = await GenUser.countDocuments();
        const deleteResult = await GenUser.deleteMany({ role: { $ne: "admin" } });
        console.log(`❌ Deleted ${deleteResult.deletedCount} non-admin users (was ${initialUserCount})`);

        // 3. Ensure Admin Exists & Reset Password
        const email = "admin@example.com";
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const adminUpdate = {
            name: "Super Admin",
            email: email,
            password: hashedPassword,
            role: "admin",
            phoneNumber: "0000000000",
        };

        // Upsert: Update if exists, Insert if not
        await GenUser.findOneAndUpdate({ role: "admin" }, adminUpdate, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        });

        console.log("\n✅ Database Cleanup Complete (Admin Only Mode).");
        console.log("============================================");
        console.log("🔑 ADMIN CREDENTIALS:");
        console.log(`   Email:    ${email}`);
        console.log(`   Password: ${password}`);
        console.log("============================================");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Fatal Error:", error);
        process.exit(1);
    }
};

resetDB();
