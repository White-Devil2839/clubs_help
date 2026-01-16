const cron = require('node-cron');
const Event = require('../models/Event');

const setupCronJobs = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('Running Cron Job: Cleaning past events...');
        try {
            const today = new Date();
            const result = await Event.deleteMany({ date: { $lt: today } });
            console.log(`Deleted ${result.deletedCount} past events.`);
        } catch (error) {
            console.error('Error in Cron Job:', error);
        }
    });
};

module.exports = setupCronJobs;
