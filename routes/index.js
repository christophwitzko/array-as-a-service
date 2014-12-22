'use strict'


var bodyParser = require('body-parser')

var handlers = require('./handlers.js')

module.exports = function(app, store){
  var h = handlers(store)
  app.use(bodyParser.text())
  app.post('/new', h.new)
  app.get('/:id', h.checkId, h.get)
  app.delete('/:id', h.checkId, h.remove)
  app.get('/:id/pop', h.checkId, h.pop)
  app.get('/:id/shift', h.checkId, h.shift)
  app.post('/:id/push', h.checkId, h.push)
  app.post('/:id/unshift', h.checkId, h.unshift)
}
