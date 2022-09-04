const cron = require('node-cron')
const sendEmailBirthday = require('./task/sendEmailBirthday')

// check birthday every 10 second
const task = cron.schedule('*/10 * * * * *', () => {
  sendEmailBirthday();
}, {
  scheduled: false
})

module.exports = task