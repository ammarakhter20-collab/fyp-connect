const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/MIS";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");

  const result = await mongoose.connection.db.collection("studentreports").deleteOne({
    _id: new mongoose.Types.ObjectId('6a0c2833a43c56ddde088177')
  });

  console.log("Deleted count:", result.deletedCount);
  await mongoose.disconnect();
}

main().catch(console.error);
