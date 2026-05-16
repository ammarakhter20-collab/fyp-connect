
const mongoose = require('mongoose');

// const mongoURI = "mongodb://0.0.0.0:27017/FYP";
const mongoURI = "mongodb://localhost:27017/MIS";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            console.log("--- Inspecting Raw Collection ---");
            // Guessing collection name based on model name 'CreateExamModel' -> 'createexammodels'
            let coll = mongoose.connection.db.collection('createexammodels');
            let docs = await coll.find({}).limit(1).toArray();

            if (docs.length === 0) {
                console.log("No docs in 'createexammodels'. Trying 'createexams'...");
                coll = mongoose.connection.db.collection('createexams');
                docs = await coll.find({}).limit(1).toArray();
            }

            if (docs.length > 0) {
                console.log("Raw Document:", JSON.stringify(docs[0], null, 2));
            } else {
                console.log("No documents found in either collection.");
            }

        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
