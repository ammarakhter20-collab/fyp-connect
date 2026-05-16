const mongoose = require('mongoose');

async function wipeData() {
  try {
    const dbUrl = 'mongodb://127.0.0.1:27017/MIS';
    
    await mongoose.connect(dbUrl);
    console.log(`Connected to MongoDB at ${dbUrl}`);

    const collections = await mongoose.connection.db.collections();
    console.log('Found ' + collections.length + ' collections');

    for (let collection of collections) {
      const name = collection.collectionName;
      // We want to KEEP 'genusers' where role is 'admin', 'faculty', 'coordinator', or 'hod'
      if (name === 'genusers') {
        const result = await collection.deleteMany({
          role: { $nin: ['admin', 'faculty', 'coordinator', 'hod', 'Admin', 'Faculty', 'Coordinator', 'HoD'] }
        });
        console.log(`Deleted ${result.deletedCount} documents from genusers (kept admin/faculty/coordinator/hod)`);
      } else if (name === 'departments' || name === 'programs') {
         console.log(`Skipped dropping configuration collection: ${name}`);
      } else {
        await collection.drop();
        console.log(`Dropped collection: ${name}`);
      }
    }
    
    console.log('Data wipe complete!');
  } catch (err) {
    console.error('Error wiping data:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

wipeData();
