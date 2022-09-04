const mysql = require('mysql2')
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'birthday',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
  timezone: process.env.TZ,
  dateStrings: true,
})

module.exports = connection.promise();