const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const connection = require('../../database/mysql')

/* DELETE user. */
router.delete(
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

    const [results] = await connection.execute('DELETE FROM user WHERE (id = ?)', [req.params.id])

    if (results.affectedRows === 0) {
      res.json({
        status: false,
        message: 'id not found'
      })
      return
    }

    res.json({
      status: true,
      message: `user id ${req.params.id} has been deleted`
    })
  }
)

module.exports = router