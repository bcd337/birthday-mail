const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const connection = require('../../database/mysql')

/* CREATE user. */
router.post(
  '/', 
  check('email').isEmail().withMessage('email must valid'),
  check('timezone').isLength({ min: 6, max: 6 }).optional({ nullable: true }).withMessage('example timezone format +00:00'),
  check('first_name').isLength({ min: 1 }).withMessage('first_name must not empty'),
  check('birthday').isDate({ format: 'YYYY-MM-DD'}).withMessage('birthday format is YYYY-MM-DD'),
  async function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: false,
        errors: errors.array()
      })
      return
    }

    const { first_name, last_name, birthday, timezone, email } = req.body

    console.log('process.env.TZ', process.env.TZ, timezone)

    const [results] = await connection.execute(
      "INSERT INTO user (first_name, last_name, email, birthday, timezone) VALUES (:first_name, :last_name, :email, :birthday, :timezone)",
      {
        first_name,
        last_name,
        email,
        birthday,
        timezone: timezone || process.env.TZ,
      },
    ).catch(() => ([{ affectedRows: 0 }]))

    if (!results.insertId) {
      res.json({
        status: false,
        message: 'failed create user'
      })
      return
    } 

    res.json({
      status: true,
      message: 'user has been created',
      data: {
        id: results.insertId,
      }
    })
  }
)

module.exports = router