'use strict'

var debug = require('debug')('aaas:main')
var express = require('express')
var app = express()

var e = process.env

var storeType = (e.USE_REDIS ? e.USE_REDIS.toLowerCase() === 'true' : false) ? 'Redis' : 'Memory'
debug('using "%s" store', storeType)
var store = require('./stores')[storeType](e.REDIS_URL || e.REDISTOGO_URL)

require('./routes')(app, store)

var port = e.PORT || 3000
app.listen(port , function(){
  debug('listening on %d', port)
})
