const mongoose = require('mongoose');
const FYPTerm = require('./models/AdminModels/fypTerm');
// Adjust path if run from root. If run from server dir, use ./models/...
// I will assume I run this from root based on recent context, or I'll adjust.
// Let's create it in 'server' directory to match verify_single_term.js pattern and run from there.

async function deleteTerms() {
    try {
        await mongoose.connect('mongodb://localhost:27017/MIS', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const result = await FYPTerm.deleteMany({});
        console.log(`Deleted ${result.deletedCount} terms.`);

    } catch (error) {
        console.error('Error deleting terms:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Connection closed');
    }
}

deleteTerms();
