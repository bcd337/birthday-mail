const express = require('express')
const router = express.Router()
const getRoute = require('./get')
const createRoute = require('./create')
const readRoute = require('./read')
const updateRoute = require('./update')
const deleteRoute = require('./delete')

router
  .use(getRoute)
  .use(createRoute)
  .use(readRoute)
  .use(updateRoute)
  .use(deleteRoute)

module.exports = router