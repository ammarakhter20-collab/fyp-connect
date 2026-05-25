const mongoose = require("mongoose");
async function run() {
  await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
  const db = mongoose.connection.db;
  const doc = await db.collection("fypregistrations").findOne({});
  console.log("FYP Registration Doc:", JSON.stringify(doc, null, 2));
  await mongoose.disconnect();
}
run();
