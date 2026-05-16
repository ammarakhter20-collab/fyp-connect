const mongoose = require('mongoose');
require('dotenv').config();
const GenUser = require('./server/models/AdminModels/GenUserModel');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const users = await GenUser.find({ email: /ammar/i });
        console.log("--- Users matching ammar ---");
        users.forEach(u => console.log(`Email: ${u.email}, Role: ${u.role}, Name: ${u.name}`));
        await mongoose.disconnect();
    } catch (e) { console.error(e); }
}
check();
