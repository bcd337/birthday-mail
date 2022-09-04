const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const connection = require('../../database/mysql')

/* UPDATE user. */
router.put(
  '/:id',
  check('id').isNumeric().withMessage('id must number'),
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

    const { first_name, last_name, email, birthday, timezone } = req.body

    const [results] = await connection.execute(
      `UPDATE user SET
        first_name = :first_name,
        last_name = :last_name,
        email = :email,
        birthday = :birthday,
        timezone = :timezone
      WHERE (id = :id)`,
      {
        id: req.params.id,
        first_name,
        last_name,
        email,
        birthday,
        timezone: timezone || process.env.TZ,
      },
    ).catch(() => ([{ affectedRows: 0 }]))

    if (!results.affectedRows) {
      res.json({
        status: false,
        message: 'failed update user',
      })
      return
    } 

    res.json({
      status: true,
      message: 'user has been updated',
      data: {
        id: req.params.id,
      }
    })
  }
)

module.exports = router
