const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/FYP PORTAL CODE/BE-BackUpBeforeWholeIntegration/BE-BackUpBeforeWholeIntegration/.env' });

const FYPTerm = require('./server/models/AdminModels/fypTerm');

async function debugTerms() {
    try {
        const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/MIS';
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        const terms = await FYPTerm.find({});
        console.log("All terms:");
        terms.forEach(t => {
            console.log(`- ID: ${t._id}, sessionTerm: '${t.sessionTerm}' (type: ${typeof t.sessionTerm})`);
        });

        const sessionTerm = "213";
        console.log(`\nQuerying for sessionTerm: '${sessionTerm}'`);
        const foundStr = await FYPTerm.findOne({ sessionTerm: sessionTerm });
        console.log("Result with string:", foundStr ? `Found: ${foundStr._id}` : "Not found");

        const foundNum = await FYPTerm.findOne({ sessionTerm: 213 });
        console.log("Result with number:", foundNum ? `Found: ${foundNum._id}` : "Not found");

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

debugTerms();
