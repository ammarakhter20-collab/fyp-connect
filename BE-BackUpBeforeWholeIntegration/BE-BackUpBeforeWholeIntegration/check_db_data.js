const mongoose = require('mongoose');
require('dotenv').config();

const Department = require('./server/models/AdminModels/department');
const Program = require('./server/models/AdminModels/program');
const FYPTerm = require('./server/models/AdminModels/fypTerm');

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");

        const departments = await Department.find({}, 'departmentName');
        console.log("Departments:", departments.map(d => d.departmentName));

        const programs = await Program.find({}, 'programTitle');
        console.log("Programs:", programs.map(p => p.programTitle));

        const terms = await FYPTerm.find({}, 'sessionTerm');
        console.log("Terms:", terms.map(t => t.sessionTerm));

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

checkData();
