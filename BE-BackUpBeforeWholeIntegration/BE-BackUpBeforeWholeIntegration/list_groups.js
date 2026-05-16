const mongoose = require('mongoose');
require('dotenv').config();

const FypRegistration = require('./server/models/StudentModels/fypRegModel');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const groups = await FypRegistration.find({}).populate('topicData');
        console.log("--- All Groups ---");
        groups.forEach(g => {
            console.log(`ID: ${g._id}, Title: ${g.fypTitle}, Topic: ${g.topicData?.topic}`);
        });
        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}

check();
