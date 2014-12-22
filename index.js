'use strict'

var debug = require('debug')('aaas:main')
var express = require('express')
var app = express()

var storeType = process.env.USE_REDIS ? 'Redis' : 'Memory'
debug('using "%s" store', storeType)
var store = require('./stores')[storeType]()

require('./routes')(app, store)

var port = process.env.PORT || 3000
app.listen(port , function(){
  debug('listening on %d', port)
})
