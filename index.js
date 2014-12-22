'use strict'

var debug = require('debug')('aaas:main')
var express = require('express')
var app = express()

var port = process.env.PORT || 3000
app.listen(port , function(){
  debug('Listening on %d', port)
})
