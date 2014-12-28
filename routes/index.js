'use strict'

var bodyParser = require('body-parser')

var handlers = require('./handlers.js')

module.exports = function(app, store){
  var h = handlers(store)
  app.use(bodyParser.text())
  app.post('/new', h.newA)
  app.get('/:id', h.checkId, h.getA)
  app.delete('/:id', h.checkId, h.removeA)
  app.get('/:id/pop', h.checkId, h.pop)
  app.get('/:id/shift', h.checkId, h.shift)
  app.post('/:id/push', h.checkId, h.checkBody, h.push)
  app.post('/:id/unshift', h.checkId, h.checkBody, h.unshift)
  app.post('/:id/indexof', h.checkId, h.checkBody, h.indexOf)
  app.post('/:id/indexof/:index', h.checkId, h.checkIndex, h.checkBody, h.indexOf)
  app.post('/:id/:index', h.checkId, h.checkIndex, h.checkBody, h.set)
  app.get('/:id/:index', h.checkId, h.checkIndex, h.get)
  app.delete('/:id/:index', h.checkId, h.checkIndex, h.remove)
  app.get('/:id/:begin/:end', h.checkId, h.checkBeginEnd, h.slice)
}
