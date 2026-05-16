const mongoose = require("mongoose");
require("dotenv").config();

const GenUser = require("./server/models/AdminModels/GenUserModel");
const FypRegistration = require("./server/models/StudentModels/fypRegModel");
const FYPTerm = require("./server/models/AdminModels/fypTerm");

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/MIS");
        console.log("Connected.");

        const term231 = await FYPTerm.findOne({ sessionTerm: "231-1" });
        console.log("Term 231-1 ID:", term231 ? term231._id : "NOT FOUND");

        const allRegs = await FypRegistration.find({}).populate('term');
        console.log("Found Registrations:", allRegs.length);
        allRegs.forEach(r => {
            console.log(`- Reg ID: ${r._id}, Term: ${r.term ? r.term.sessionTerm : 'None'} (${r.term?._id})`);
        });

        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

checkData();
