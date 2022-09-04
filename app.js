const createError = require('http-errors')
const express = require('express')
const debug = require('debug')('birthday:server')

const usersRouter = require('./routes/users/index')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  debug('err.message', err.message)

  res.status(err.status || 500)
  res.json(err)
})

module.exports = app
