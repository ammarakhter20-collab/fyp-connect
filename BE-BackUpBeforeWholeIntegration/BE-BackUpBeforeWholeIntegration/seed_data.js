const mongoose = require('mongoose');
require('dotenv').config();

const Department = require('./server/models/AdminModels/department');
const Program = require('./server/models/AdminModels/program');
const FYPTerm = require('./server/models/AdminModels/fypTerm');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        // Create Department
        let csDep = await Department.findOne({ departmentName: "Computer Science" });
        if (!csDep) {
            csDep = await Department.create({
                departmentName: "Computer Science",
                description: "Computer Science Department"
            });
            console.log("Created Computer Science Department");
        }

        let seDep = await Department.findOne({ departmentName: "Software Engineering" });
        if (!seDep) {
            seDep = await Department.create({
                departmentName: "Software Engineering",
                description: "Software Engineering Department"
            });
            console.log("Created Software Engineering Department");
        }

        // Create Term
        let term = await FYPTerm.findOne({ sessionTerm: "Fall-2023" });
        if (!term) {
            term = await FYPTerm.create({
                sessionTerm: "Fall-2023",
                startDate: new Date("2023-09-01"),
                endDate: new Date("2024-01-31"),
                isActive: true,
                status: "activated"
            });
            console.log("Created Term Fall-2023");
        }

        // Create Programs
        let bscs = await Program.findOne({ programTitle: "BSCS" });
        if (!bscs) {
            await Program.create({
                programTitle: "BSCS",
                shortCode: "CS",
                department: csDep._id
            });
            console.log("Created Program BSCS");
        }

        let bsse = await Program.findOne({ programTitle: "BSSE" });
        if (!bsse) {
            await Program.create({
                programTitle: "BSSE",
                shortCode: "SE",
                department: seDep._id
            });
            console.log("Created Program BSSE");
        }

        console.log("Seeding complete!");
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
