const mongoose = require("mongoose");

const run = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("Connected to MongoDB successfully.");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log("\n--- COLLECTION DOCUMENT COUNTS ---");
    for (let col of collections) {
      const name = col.name;
      const count = await db.collection(name).countDocuments();
      console.log(`${name}: ${count}`);
    }

    console.log("\n--- FYP TERMS ---");
    const terms = await db.collection("fypterms").find({}).toArray();
    for (let t of terms) {
      console.log(`Term ID: ${t._id}, SessionTerm: ${t.sessionTerm}, Status: ${t.status}`);
    }

  } catch (err) {
    console.error("Error connecting/querying DB:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
