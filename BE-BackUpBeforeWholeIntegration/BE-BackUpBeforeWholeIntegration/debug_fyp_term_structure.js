
const mongoose = require('mongoose');
const FypRegistration = require('./server/models/StudentModels/fypRegModel');

// const mongoURI = "mongodb://0.0.0.0:27017/FYP";
const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            console.log("--- Fetching one FYP Group to check 'term' field ---");
            const group = await FypRegistration.findOne().lean(); // Use lean() to get raw JS object, no mongoose magic
            if (group) {
                console.log("Group ID:", group._id);
                console.log("Term Value:", group.term);
                console.log("Type of Term:", typeof group.term);
                if (group.term && typeof group.term === 'object') {
                    console.log("Term Keys:", Object.keys(group.term));
                    console.log("Is ObjectId?", group.term instanceof mongoose.Types.ObjectId);
                }
            } else {
                console.log("No group found.");
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
