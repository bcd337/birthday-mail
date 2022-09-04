const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const connection = require('../../database/mysql')

/* READ user detail. */
router.get(
  '/:id', 
  check('id').isNumeric().withMessage('id must number'),
  async function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: false,
        errors: errors.array()
      })
      return
    }

    const [rows] = await connection.execute('SELECT id, first_name, last_name, email, birthday, timezone FROM user WHERE id = ?', [req.params.id])
  
    if (rows.length === 0) {
      res.json({
        status: false,
        message: `user id ${req.params.id} not found`,
      })
      return
    }

    res.json({
      status: true,
      data: {
        user: rows[0],
      }
    })
  }
)

module.exports = router