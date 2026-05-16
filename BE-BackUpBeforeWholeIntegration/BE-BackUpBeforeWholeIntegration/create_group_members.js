const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const GenUser = require("./server/models/AdminModels/GenUserModel");

const createGroupMembers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        // 1. Get the Reference Student (to match Dept/Prog/Term)
        const refStudent = await GenUser.findOne({ email: "student@test.com" });
        if (!refStudent) {
            console.error("Reference student (student@test.com) not found!");
            process.exit(1);
        }

        const commonPassword = "password123";
        // const hashedPassword = await bcrypt.hash(commonPassword, 10); // relying on pre-save hook

        const members = [
            {
                name: "Group Member One",
                email: "member1@test.com",
                registrationNumber: `MB-${Math.floor(Math.random() * 10000)}`,
                phoneNumber: `0300-111111${Math.floor(Math.random() * 10)}`
            },
            {
                name: "Group Member Two",
                email: "member2@test.com",
                registrationNumber: `MB-${Math.floor(Math.random() * 10000)}`,
                phoneNumber: `0300-222222${Math.floor(Math.random() * 10)}`
            }
        ];

        for (const m of members) {
            // Delete existing if any
            await GenUser.deleteOne({ email: m.email });

            const newMember = new GenUser({
                role: "Student",
                name: m.name,
                email: m.email,
                password: commonPassword,
                registrationNumber: m.registrationNumber,
                phoneNumber: m.phoneNumber,
                department: refStudent.department,  // Same Department
                program: refStudent.program,        // Same Program
                term: refStudent.term,              // Same Term
                partStatus: "part-I"
            });

            await newMember.save();
            console.log(`Created Member: ${m.name} (${m.email})`);
        }

        console.log("Group members created successfully.");
        await mongoose.disconnect();

    } catch (error) {
        console.error("Error creating group members:", error);
    }
};

createGroupMembers();
