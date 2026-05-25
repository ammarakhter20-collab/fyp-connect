const mongoose = require("mongoose");

const run = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MIS");
    console.log("Connected to MongoDB successfully.");

    const db = mongoose.connection.db;

    // Define termId to delete (Session 261)
    const termId = "6a0c0d385093fad6fd261d48";
    const termObjectId = new mongoose.Types.ObjectId(termId);

    console.log(`\nDeleting Term: ${termId}`);

    // Replicate logic from controller:

    // 1. Find all FypRegistration groups belonging to this term
    const groupConditions = [
      { term: termId },
      { "term._id": termId },
      { "term.termId": termId }
    ];
    if (mongoose.Types.ObjectId.isValid(termId)) {
      groupConditions.push(
        { term: termObjectId },
        { "term._id": termObjectId },
        { "term.termId": termObjectId }
      );
    }

    const groups = await db.collection("fypregistrations").find({ $or: groupConditions }).toArray();
    const groupIds = groups.map(g => g._id);
    console.log(`Found ${groupIds.length} groups to delete.`);

    // 2. Delete group-dependent records
    if (groupIds.length > 0) {
      const attResult = await db.collection("fypgroupattendances").deleteMany({ fypgroup: { $in: groupIds } });
      console.log(`Deleted attendances: ${attResult.deletedCount}`);

      const marksResult = await db.collection("exammarks").deleteMany({ groupId: { $in: groupIds } });
      console.log(`Deleted marks: ${marksResult.deletedCount}`);

      const taskResult = await db.collection("taskassignments").deleteMany({ groupId: { $in: groupIds } });
      console.log(`Deleted task assignments: ${taskResult.deletedCount}`);

      const reportResult = await db.collection("studentreports").deleteMany({ FYPGroup: { $in: groupIds } });
      console.log(`Deleted student reports: ${reportResult.deletedCount}`);

      const topicResult = await db.collection("fyptopicchangerequests").deleteMany({ groupId: { $in: groupIds } });
      console.log(`Deleted topic change requests: ${topicResult.deletedCount}`);

      const techResult = await db.collection("fyptechnologychangerequests").deleteMany({ groupId: { $in: groupIds } });
      console.log(`Deleted tech change requests: ${techResult.deletedCount}`);

      const grpChangeResult = await db.collection("fypchangerequests").deleteMany({ fypGroup: { $in: groupIds } });
      console.log(`Deleted group change requests: ${grpChangeResult.deletedCount}`);

      const feedbackResult = await db.collection("feedbacks").deleteMany({ groupId: { $in: groupIds } });
      console.log(`Deleted feedbacks: ${feedbackResult.deletedCount}`);
    }

    // 3. Delete direct term-dependent records
    const userResult = await db.collection("genusers").deleteMany({ role: "Student", term: { $in: [termId, termObjectId] } });
    console.log(`Deleted GenUsers: ${userResult.deletedCount}`);

    const groupDelResult = await db.collection("fypregistrations").deleteMany({ $or: groupConditions });
    console.log(`Deleted groups: ${groupDelResult.deletedCount}`);

    const examResult = await db.collection("createexammodels").deleteMany({ Term: { $in: [termId, termObjectId] } });
    console.log(`Deleted exams: ${examResult.deletedCount}`);

    const examAssignResult = await db.collection("examassignments").deleteMany({ termId: { $in: [termId, termObjectId] } });
    console.log(`Deleted exam assignments: ${examAssignResult.deletedCount}`);

    const panelResult = await db.collection("paneldetails").deleteMany({ term: { $in: [termId, termObjectId] } });
    console.log(`Deleted panels: ${panelResult.deletedCount}`);

    const deadlineResult = await db.collection("fypregistrationdeadlines").deleteMany({ term: { $in: [termId, termObjectId] } });
    console.log(`Deleted deadlines: ${deadlineResult.deletedCount}`);

    const pfResult = await db.collection("passfailcriterias").deleteMany({ term: { $in: [termId, termObjectId] } });
    console.log(`Deleted pass/fail criteria: ${pfResult.deletedCount}`);

    const percentageResult = await db.collection("supervisorpercentages").deleteMany({ term: { $in: [termId, termObjectId] } });
    console.log(`Deleted supervisor percentages: ${percentageResult.deletedCount}`);

    // 4. Pull/remove the term from terms arrays in Evaluations and Results
    const evalResult = await db.collection("evaluations").updateMany(
      { "terms.termId": { $in: [termId, termObjectId] } },
      { $pull: { terms: { termId: { $in: [termId, termObjectId] } } } }
    );
    console.log(`Updated evaluations (pull term): ${evalResult.modifiedCount}`);

    const resUpdateResult = await db.collection("results").updateMany(
      { "terms.termId": { $in: [termId, termObjectId] } },
      { $pull: { terms: { termId: { $in: [termId, termObjectId] } } } }
    );
    console.log(`Updated results (pull term): ${resUpdateResult.modifiedCount}`);

    // 5. Delete term itself
    const termDelResult = await db.collection("fypterms").deleteOne({ _id: termObjectId });
    console.log(`Deleted term itself: ${termDelResult.deletedCount}`);

  } catch (err) {
    console.error("Error running test deletion:", err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
