'use strict'

var debug = require('debug')('aaas:main')
var express = require('express')
var app = express()

var storeType = (process.env.USE_REDIS ? process.env.USE_REDIS.toLowerCase() === 'true' : false) ? 'Redis' : 'Memory'
debug('using "%s" store', storeType)
var store = require('./stores')[storeType](process.env.REDIS_URL || process.env.REDISTOGO_URL)

require('./routes')(app, store)

var port = process.env.PORT || 3000
app.listen(port , function(){
  debug('listening on %d', port)
})
