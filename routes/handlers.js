'use strict'

var debug = require('debug')('aaas:routes')

module.exports = function(store){
  return {
    checkId: function(req, res, next){
      var id = req.params.id
      debug('checking id: %s', id)
      if(id && id.length !== 16) return res.send({error: 'invalid id'})
      next()
    },
    new: function(req, res){
      store.newArray(function(err, id){
        if(err) {
          debug('error: %s', err)
          return res.send({error: err})
        }
        debug('generated new array: %s', id)
        res.send({id: id})
      })
    },
    get: function(req, res){
      var id = req.params.id
      debug('getting id: %s', id)
      store.getArray(req.params.id, function(err, data){
        if(err) {
          debug('error: %s', err)
          return res.send({error: err})
        }
        res.send({data: data})
      })
    },
    remove: function(req, res){
      var id = req.params.id
      debug('deleting id: %s', id)
      store.removeArray(id, function(err){
        if(err) debug('error: %s', err)
        return res.send({error: err})
      })
    },
    pop: function(req, res){
      var id = req.params.id
      debug('poping from id: %s', id)
      store.pop(id, function(err, data){
        if(err) {
          debug('error: %s', err)
          return res.send({error: err})
        }
        res.send({data: data})
      })
    },
    shift: function(req, res){
      var id = req.params.id
      debug('shifting from id: %s', id)
      store.shift(id, function(err, data){
        if(err) {
          debug('error: %s', err)
          return res.send({error: err})
        }
        res.send({data: data})
      })
    },
    push: function(req, res){
      var id = req.params.id
      debug('pushing to id: %s', id)
      if(!req.body) return res.send({error: 'no data'})
      store.push(id, req.body, function(err){
        if(err) debug('error: %s', err)
        return res.send({error: err})
      })
    },
    unshift: function(req, res){
      var id = req.params.id
      debug('unshifting to id: %s', id)
      if(!req.body) return res.send({error: 'no data'})
      store.unshift(id, req.body, function(err){
        if(err) debug('error: %s', err)
        return res.send({error: err})
      })
    }
  }
}