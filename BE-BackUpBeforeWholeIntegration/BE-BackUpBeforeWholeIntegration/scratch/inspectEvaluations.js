const mongoose = require("mongoose");

const run = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("Connected to MongoDB successfully.");

    const db = mongoose.connection.db;

    const evaluations = await db.collection("evaluations").find({}).toArray();
    console.log(`\nFound ${evaluations.length} evaluations:`);
    console.log(JSON.stringify(evaluations, null, 2));

    const results = await db.collection("results").find({}).toArray();
    console.log(`\nFound ${results.length} results:`);
    console.log(JSON.stringify(results, null, 2));

    const schedules = await db.collection("createexamschedules").find({}).toArray();
    console.log(`\nFound ${schedules.length} schedules:`);
    console.log(JSON.stringify(schedules, null, 2));

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
