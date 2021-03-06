const schedule = require('node-schedule');

require('dotenv').config();

const { getExpServiceTime } = require('./helpers/auchan');
const { sendTweet } = require('./helpers/twitter');


const scheduleGetInfo = async () => {
    const rule = new schedule.RecurrenceRule();

    rule.minute = new schedule.Range(0, 59, 30);

    schedule.scheduleJob(rule, async () => {
      const result = await getExpServiceTime();

      sendTweet(result);
    });
};

scheduleGetInfo();