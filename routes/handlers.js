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
    checkIndex: function(req, res, next){
      var index = parseInt(req.params.index, 10)
      if(isNaN(index)) return res.send({error: 'invalid index'})
      req.params.index = index
      next()
    },
    checkBody: function(req, res, next){
      if(!req.body) {
        debug('body is empty id: %s', req.params.id)
        return res.send({error: 'no data'})
      }
      next()
    },
    newA: function(req, res){
      store.newArray(function(err, id){
        if(err) {
          debug('error: %s', err)
          return res.send({error: err.message || err})
        }
        debug('generated new array: %s', id)
        res.send({id: id})
      })
    },
    getA: function(req, res){
      var id = req.params.id
      debug('getting id: %s', id)
      store.getArray(req.params.id, function(err, data){
        if(err) {
          debug('error: %s', err)
          return res.send({error: err.message || err})
        }
        res.send({data: data})
      })
    },
    removeA: function(req, res){
      var id = req.params.id
      debug('deleting id: %s', id)
      store.removeArray(id, function(err){
        if(err) debug('error: %s', err)
        return res.send({error: err.message || err})
      })
    },
    pop: function(req, res){
      var id = req.params.id
      debug('poping from id: %s', id)
      store.pop(id, function(err, data){
        if(err) {
          debug('error: %s', err)
          return res.send({error: err.message || err})
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
          return res.send({error: err.message || err})
        }
        res.send({data: data})
      })
    },
    push: function(req, res){
      var id = req.params.id
      debug('pushing to id: %s', id)
      store.push(id, req.body, function(err){
        if(err) debug('error: %s', err)
        return res.send({error: err.message || err})
      })
    },
    unshift: function(req, res){
      var id = req.params.id
      debug('unshifting to id: %s', id)
      store.unshift(id, req.body, function(err){
        if(err) debug('error: %s', err)
        return res.send({error: err.message || err})
      })
    },
    set: function(req, res){
      var id = req.params.id
      var index = req.params.index
      debug('setting at %d to id: %s', index, id)
      store.set(id, index, req.body, function(err){
        if(err) debug('error: %s', err)
        return res.send({error: err.message || err})
      })
    },
    get: function(req, res){
      var id = req.params.id
      var index = req.params.index
      debug('getting at %d from id: %s', index, id)
      store.get(id, index, function(err, data){
        if(err) {
          debug('error: %s', err)
          return res.send({error: err.message || err})
        }
        res.send({data: data})
      })
    },
    remove: function(req, res){
      var id = req.params.id
      var index = req.params.index
      debug('removing at %d from id: %s', index, id)
      store.remove(id, index, function(err, data){
        if(err) {
          debug('error: %s', err)
          return res.send({error: err.message || err})
        }
        res.send({data: data})
      })
    },
    indexOf: function(req, res){
      var id = req.params.id
      var index = req.params.index || 0
      debug('indexOf at %d from id: %s', index, id)
      store.indexOf(id, req.body, index, function(err, data){
        if(err) {
          debug('error: %s', err)
          return res.send({error: err.message || err})
        }
        res.send({index: data})
      })
    },
    slice: function(req, res){
      var id = req.params.id
      var begin = req.params.begin
      var end = req.params.end
      debug('slicing at (%s - %s) from id: %s', begin, end, id)
      store.slice(id, begin, end, function(err, data){
        if(err) {
          debug('error: %s', err)
          return res.send({error: err.message || err})
        }
        res.send({data: data})
      })
    }
  }
}
