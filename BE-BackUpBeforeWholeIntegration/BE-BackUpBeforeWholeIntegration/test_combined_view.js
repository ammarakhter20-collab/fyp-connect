const mongoose = require('mongoose');
const axios = require('axios');

// MongoDB Connection
const MONGO_URI = 'mongodb://localhost:27017/FYP'; // Update if different

// Your auth token (you'll need to paste this after logging in)
let AUTH_TOKEN = 'PASTE_YOUR_TOKEN_HERE';

async function testCombinedView() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const FYPTerm = require('./server/models/AdminModels/fypTerm');
        const FypRegistration = require('./server/models/StudentModels/fypRegModel');

        // Step 1: Find term IDs
        console.log('📋 Step 1: Finding term IDs...');
        const term231_1 = await FYPTerm.findOne({ sessionTerm: '231-1' });
        const term231_2 = await FYPTerm.findOne({ sessionTerm: '231-2' });

        if (!term231_1) {
            console.log('❌ Term 231-1 not found');
            process.exit(1);
        }

        console.log(`✅ Term 231-1 found: ${term231_1._id}`);

        if (!term231_2) {
            console.log('⚠️  Term 231-2 not found. Creating it...');
            const newTerm = new FYPTerm({
                sessionTerm: '231-2',
                status: 'activated',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await newTerm.save();
            console.log(`✅ Term 231-2 created: ${newTerm._id}`);
        } else {
            console.log(`✅ Term 231-2 found: ${term231_2._id}`);
        }

        // Reload term231_2 to ensure we have the latest
        const finalTerm2 = await FYPTerm.findOne({ sessionTerm: '231-2' });

        // Step 2: Check if groups already promoted
        console.log('\n📋 Step 2: Checking if groups are already promoted...');
        const existingPromotions = await FypRegistration.countDocuments({
            term: finalTerm2._id,
            partStatus: 'part-II'
        });

        console.log(`Found ${existingPromotions} groups already in Part II`);

        // Step 3: Show API call for promotion
        console.log('\n📋 Step 3: API Call to Promote Groups');
        console.log('=====================================');
        console.log('POST http://localhost:5000/api/CreateFYPRegRoutes/promote-to-part-ii');
        console.log('Headers:');
        console.log('  Authorization: Bearer YOUR_TOKEN_HERE');
        console.log('  Content-Type: application/json');
        console.log('\nBody:');
        console.log(JSON.stringify({
            partITermId: term231_1._id.toString(),
            partIITermId: finalTerm2._id.toString()
        }, null, 2));

        // Step 4: Make the promotion call if token provided
        if (AUTH_TOKEN !== 'PASTE_YOUR_TOKEN_HERE') {
            console.log('\n📋 Step 4: Promoting groups...');
            try {
                const response = await axios.post(
                    'http://localhost:5000/api/CreateFYPRegRoutes/promote-to-part-ii',
                    {
                        partITermId: term231_1._id.toString(),
                        partIITermId: finalTerm2._id.toString()
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${AUTH_TOKEN}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log('✅ Groups promoted successfully!');
                console.log(`   Promoted ${response.data.promotedCount} groups`);
            } catch (error) {
                if (error.response?.status === 400 && error.response.data.alreadyPromoted) {
                    console.log('ℹ️  Groups already promoted');
                } else {
                    console.log('❌ Error promoting groups:', error.response?.data || error.message);
                }
            }
        }

        // Step 5: Manual testing instructions
        console.log('\n\n📝 MANUAL TESTING INSTRUCTIONS');
        console.log('================================\n');
        console.log('1. Open your browser and go to: http://localhost:3000');
        console.log('2. Log in as Coordinator');
        console.log('3. Navigate to "Manage Exams" or "Assigned Exams"');
        console.log('4. Select Term: 231-2');
        console.log('5. Add marks for these exams:');
        console.log('   - Attendance-II');
        console.log('   - Mid-II');
        console.log('   - Final-II');
        console.log('6. Go to "Results" page');
        console.log('7. Select Term: 231-1');
        console.log('8. Select "Overall Result List" and click "Done"');
        console.log('9. You should see the "View Combined Part I + Part II Report" button');
        console.log('10. Click it to see the combined results!\n');

        console.log('\n✨ Test setup complete!');

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run if AUTH_TOKEN is provided as environment variable
if (process.env.AUTH_TOKEN) {
    AUTH_TOKEN = process.env.AUTH_TOKEN;
}

testCombinedView();
