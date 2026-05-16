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
      await collection.drop();
      console.log(`Dropped collection: ${name}`);
    }
    
    console.log('Data wipe complete! ALL collections have been removed.');
  } catch (err) {
    console.error('Error wiping data:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

wipeData();
