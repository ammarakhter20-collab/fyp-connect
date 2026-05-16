const mongoose = require('mongoose');
require('dotenv').config();
const { generateOverallFYPResult } = require('./server/controllers/CoordinatorController/ReportGenerationController');

mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/MIS').then(async () => {
    try {
        const req = {
            params: { termId: '69f22ae6077419a30ed28b54' },
            query: { partStatus: 'combined' } // Try what the frontend is sending
        };
        const res = {
            status: function(s) {
                this.statusCode = s;
                return this;
            },
            json: function(data) {
                console.log(`STATUS: ${this.statusCode}`);
                console.log(JSON.stringify(data, null, 2));
                mongoose.disconnect();
            }
        };
        
        await generateOverallFYPResult(req, res);
    } catch (e) {
        console.error(e);
        mongoose.disconnect();
    }
});
