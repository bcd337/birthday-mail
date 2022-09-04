const express = require('express')
const router = express.Router()
const connection = require('../../database/mysql')

/* GET users listing. */
router.get('/', async function(req, res) {
  const [rows] = await connection.query('SELECT id, first_name, last_name, email, birthday, timezone FROM user')
 
  res.json({
    status: true,
    data: {
      users: rows,
    }
  })
})

module.exports = router