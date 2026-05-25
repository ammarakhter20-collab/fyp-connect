const mongoose = require("mongoose");

const run = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("Connected to MongoDB successfully.");

    const termId = "6a0c0d385093fad6fd261d48";
    const termObjectId = new mongoose.Types.ObjectId(termId);

    const db = mongoose.connection.db;

    // Test 1: Simple string query
    const resString = await db.collection("fypregistrations").find({ term: termId }).toArray();
    console.log("Found using string termId:", resString.length);

    // Test 2: ObjectId query
    const resObj = await db.collection("fypregistrations").find({ term: termObjectId }).toArray();
    console.log("Found using ObjectId termId:", resObj.length);

    // Test 3: Robust $or query
    const query = {
      $or: [
        { term: termId },
        { term: termObjectId },
        { "term._id": termId },
        { "term._id": termObjectId },
        { "term.termId": termId },
        { "term.termId": termObjectId }
      ]
    };
    const resOr = await db.collection("fypregistrations").find(query).toArray();
    console.log("Found using robust OR query:", resOr.length);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
