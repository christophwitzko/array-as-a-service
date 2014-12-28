'use strict'

var debug = require('debug')('aaas:routes')

function handleError(res, err){
  if(err) debug('error: %s', err)
  res.send({error: (err && err.message) ? err.message : err})
}

function handleData(key){
  return function(res, err, data){
    if(err) return handleError(res, err)
    var ret = {}
    ret[key] = data
    res.send(ret)
  }
}

function storeOp(store, cmd, get, he, logTpl, aidx){
  logTpl = (logTpl || '<cmd>ing <get> id: %s').replace(/<cmd>/gm, cmd).replace(/<get>/gm, get ? 'from' : 'to')
  var handleFn = he ? handleError : handleData('data')
  return function(req, res){
    var cb = handleFn.bind(null, res)
    var id = req.params.id
    if(aidx){
      var index = req.params.index || 0
      debug(logTpl, index, id)
      if(!get) return store[cmd](id, index, req.body, cb)
      return store[cmd](id, index, cb)
    }
    debug(logTpl, id)
    if(!get) return store[cmd](id, req.body, cb)
    store[cmd](id, cb)
  }
}

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
      debug('generating new array...')
      store.newArray(handleData('id').bind(null, res))
    },
    getA: storeOp(store, 'getArray', true, false, 'getting id: %s'),
    removeA: storeOp(store, 'removeArray', true, true, 'deleting id: %s'),
    pop: storeOp(store, 'pop', true, false),
    shift: storeOp(store, 'shift', true, false),
    push: storeOp(store, 'push', false, true),
    unshift: storeOp(store, 'unshift', false, true),
    set: storeOp(store, 'set', false, true, '<cmd>ting at %d from id: %s', true),
    get: storeOp(store, 'get', true, false, '<cmd>ting at %d from id: %s', true),
    remove: storeOp(store, 'remove', true, false, 'removeing at %d from id: %s', true),
    indexOf: function(req, res){
      var id = req.params.id
      var index = req.params.index || 0
      debug('indexof at %d from id: %s', index, id)
      store.indexOf(id, req.body, index, handleData('index').bind(null, res))
    },
    slice: function(req, res){
      var id = req.params.id
      var begin = parseInt(req.params.begin, 10)
      var end = parseInt(req.params.end, 10)
      if(isNaN(begin) || isNaN(end)) return res.send({error: 'invalid begin or end'})
      debug('slicing at (%s - %s) from id: %s', begin, end, id)
      store.slice(id, begin, end, handleData('data').bind(null, res))
    }
  }
}
