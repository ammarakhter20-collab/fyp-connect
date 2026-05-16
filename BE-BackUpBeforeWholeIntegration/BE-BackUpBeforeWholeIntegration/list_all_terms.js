const mongoose = require('mongoose');
require('dotenv').config();

const FYPTerm = require('./server/models/AdminModels/fypTerm');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const terms = await FYPTerm.find({});
        console.log("--- All Terms ---");
        terms.forEach(t => {
            console.log(`ID: ${t._id}, Name: ${t.sessionTerm}, Status: ${t.status}`);
        });
        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}

check();
