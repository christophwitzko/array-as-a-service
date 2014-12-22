'use strict'

var debug = require('debug')('aaas:routes')
var bodyParser = require('body-parser')

function checkId(req, res, next){
  var id = req.params.id
  debug('checking id: %s', id)
  if(id && id.length !== 16) return res.send({error: 'invalid id'})
  next()
}

module.exports = function(app, store){
  app.use(bodyParser.text())

  app.post('/new', function(req, res){
    store.newArray(function(err, id){
      if(err) {
        debug('error: %s', err)
        return res.send({error: err})
      }
      debug('generated new array: %s', id)
      res.send({id: id})
    })
  })

  app.get('/:id', checkId, function(req, res){
    var id = req.params.id
    debug('getting id: %s', id)
    store.getArray(req.params.id, function(err, data){
      if(err) {
        debug('error: %s', err)
        return res.send({error: err})
      }
      res.send({data: data})
    })
  })

  app.delete('/:id', checkId, function(req, res){
    var id = req.params.id
    debug('deleting id: %s', id)
    store.removeArray(id, function(err){
      if(err) debug('error: %s', err)
      return res.send({error: err})
    })
  })

  app.get('/:id/pop', checkId, function(req, res){
    var id = req.params.id
    debug('poping from id: %s', id)
    store.pop(id, function(err, data){
      if(err) {
        debug('error: %s', err)
        return res.send({error: err})
      }
     res.send({data: data})
    })
  })

  app.get('/:id/shift', checkId, function(req, res){
    var id = req.params.id
    debug('shifting from id: %s', id)
    store.shift(id, function(err, data){
      if(err) {
        debug('error: %s', err)
        return res.send({error: err})
      }
     res.send({data: data})
    })
  })

  app.post('/:id/push', checkId, function(req, res){
    var id = req.params.id
    debug('pushing to id: %s', id)
    if(!req.body) return res.send({error: 'no data'})
    store.push(id, req.body, function(err){
      if(err) debug('error: %s', err)
      return res.send({error: err})
    })
  })

  app.post('/:id/unshift', checkId, function(req, res){
    var id = req.params.id
    debug('pushing to id: %s', id)
    if(!req.body) return res.send({error: 'no data'})
    store.unshift(id, req.body, function(err){
      if(err) debug('error: %s', err)
      return res.send({error: err})
    })
  })
}
