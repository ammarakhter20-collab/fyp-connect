const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Models
const Department = require("./server/models/AdminModels/department");
const Program = require("./server/models/AdminModels/program");
const FYPTerm = require("./server/models/AdminModels/fypTerm");
const GenUser = require("./server/models/AdminModels/GenUserModel");

const createTestData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected to MongoDB");

        // 1. Ensure Department
        let dept = await Department.findOne({ departmentName: "Computer Science" });
        if (!dept) {
            dept = await Department.create({ departmentName: "Computer Science" });
            console.log("Created Department: Computer Science");
        } else {
            console.log("Using existing Department:", dept.departmentName);
        }

        // 2. Ensure Program
        let prog = await Program.findOne({ programTitle: "BSCS" });
        if (!prog) {
            prog = await Program.create({
                programTitle: "BSCS",
                shortCode: "BSCS", // Required field
                department: dept._id
            });
            console.log("Created Program: BSCS");
        } else {
            console.log("Using existing Program:", prog.programTitle);
        }

        // 3. Ensure FYP Term
        let term = await FYPTerm.findOne({ sessionTerm: "Fall-2025" });
        if (!term) {
            term = await FYPTerm.create({
                sessionTerm: "Fall-2025",
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                status: "activated",
                isActive: true
            });
            console.log("Created FYP Term: Fall-2025");
        } else {
            // Activate it if not active
            if (term.status !== "activated") {
                term.status = "activated";
                await term.save();
                console.log("Activated existing term");
            }
            console.log("Using existing Term:", term.sessionTerm);
        }

        // 4. Create Users
        const commonPassword = "password123";
        const hashedPassword = await bcrypt.hash(commonPassword, 10);

        const usersToCreate = [
            {
                role: "Student",
                name: "Test Student",
                email: "student@test.com",
                registrationNumber: `ST-00${Math.floor(Math.random() * 1000)}`,
                department: dept._id,
                program: prog._id,
                term: term._id, // Required for Student
                partStatus: "part-I"
            },
            {
                role: "faculty",
                name: "Test Faculty",
                email: "faculty@test.com",
                department: dept._id,
                program: prog._id, // Optional but good to have
                // term: term._id, // NOT required for faculty
                designation: "Lecturer"
            },
            {
                role: "Coordinator", // Matches enum "Coordinator"
                name: "Test Coordinator",
                email: "coordinator@test.com",
                department: dept._id,
                // term: term._id, // NOT required for Coordinator
                designation: "Assistant Professor"
            },
            {
                role: "hod",
                name: "Test HOD",
                email: "hod@test.com",
                department: dept._id,
                // term: term._id, // NOT required for hod
                designation: "Professor"
            }
        ];

        for (const userData of usersToCreate) {
            // Delete existing user to ensure clean slate
            await GenUser.deleteOne({ email: userData.email });
            console.log(`Deleted existing user (if any): ${userData.role} -> ${userData.email}`);

            // Create new user
            const newUser = new GenUser({
                ...userData,
                password: commonPassword, // Will be hashed by pre-save hook
                phoneNumber: `0300-123456${Math.floor(Math.random() * 1000)}` // Unique phone number
            });

            try {
                await newUser.save();
                console.log(`Created User: ${userData.role} -> ${userData.email}`);
            } catch (err) {
                console.error(`Failed to create ${userData.role}:`, err.message);
                if (err.errors) {
                    Object.keys(err.errors).forEach(key => {
                        console.error(`  - ${key}: ${err.errors[key].message}`);
                    });
                }
            }
        }

        console.log("\n--- TEST CREDENTIALS ---");
        usersToCreate.forEach(u => {
            console.log(`${u.role}: ${u.email} / ${commonPassword}`);
        });

        await mongoose.disconnect();

    } catch (error) {
        console.error("Error creating test data:", error);
    }
};

createTestData();
