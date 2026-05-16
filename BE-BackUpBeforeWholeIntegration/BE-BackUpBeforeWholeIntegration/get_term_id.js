
const mongoose = require('mongoose');
const FypRegistration = require('./server/models/StudentModels/fypRegModel');

// const mongoURI = "mongodb://0.0.0.0:27017/FYP";
const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            const group = await FypRegistration.findOne({ term: { $ne: null } });
            if (group) {
                console.log("Found Term ID:", group.term._id || group.term);
            } else {
                console.log("No group with term found.");
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
