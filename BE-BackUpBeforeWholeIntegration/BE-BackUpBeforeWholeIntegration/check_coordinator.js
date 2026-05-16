
const mongoose = require('mongoose');
const Coordinator = require('./server/models/AdminModels/GenUserModel');

// const mongoURI = "mongodb://0.0.0.0:27017/FYP";
const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            const id = "69750e2bf01fb5bf751ba680";
            const user = await Coordinator.findById(id);
            if (user) {
                console.log("User found:");
                console.log(`- Name: ${user.name}`);
                console.log(`- Email (secondary): ${user.secondaryEmail}`);
                console.log(`- AppPassword: ${user.appPassword ? "SET" : "MISSING"}`);
            } else {
                console.log("User NOT found");
            }

        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
