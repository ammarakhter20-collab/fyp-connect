const mongoose = require("mongoose");

const run = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("Connected to MongoDB successfully.");

    const db = mongoose.connection.db;

    const terms = await db.collection("fypterms").find({}).toArray();
    for (let t of terms) {
      console.log(`\n========================================`);
      console.log(`TERM: ${t.sessionTerm} (ID: ${t._id})`);
      console.log(`========================================`);

      // 1. Groups
      const groups = await db.collection("fypregistrations").find({
        $or: [
          { term: t._id },
          { "term._id": t._id },
          { "term.termId": t._id }
        ]
      }).toArray();
      console.log(`- Groups count: ${groups.length}`);
      groups.forEach(g => {
        console.log(`  Group ID: ${g._id}, Title: ${g.projectTitle || g.title}`);
      });

      const groupIds = groups.map(g => g._id);

      if (groupIds.length > 0) {
        // Attendance
        const attCount = await db.collection("fypgroupattendances").countDocuments({ fypgroup: { $in: groupIds } });
        console.log(`- Attendances count: ${attCount}`);

        // Marks
        const marksCount = await db.collection("exammarks").countDocuments({ groupId: { $in: groupIds } });
        console.log(`- Marks count: ${marksCount}`);

        // Student Reports
        const reportsCount = await db.collection("studentreports").countDocuments({ FYPGroup: { $in: groupIds } });
        console.log(`- Student reports count: ${reportsCount}`);
      }

      // 2. Direct term dependencies
      // Users
      const userCount = await db.collection("genusers").countDocuments({ term: String(t._id) });
      const userCountObj = await db.collection("genusers").countDocuments({ term: t._id });
      console.log(`- GenUsers count (string id): ${userCount}, (object id): ${userCountObj}`);
      
      const users = await db.collection("genusers").find({
        $or: [
          { term: t._id },
          { term: String(t._id) }
        ]
      }).toArray();
      users.forEach(u => {
        console.log(`  User: ${u.name} (${u.role}) - Term field: ${JSON.stringify(u.term)}`);
      });

      // Exams
      const examCount = await db.collection("createexammodels").countDocuments({ Term: t._id });
      console.log(`- Exams count: ${examCount}`);

      // Pass/Fail
      const pfCount = await db.collection("passfailcriterias").countDocuments({ term: t._id });
      console.log(`- PassFailCriteria count: ${pfCount}`);

      // Deadlines
      const dlCount = await db.collection("fypregistrationdeadlines").countDocuments({ term: t._id });
      console.log(`- Deadlines count: ${dlCount}`);
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
