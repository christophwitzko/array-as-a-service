'use strict'

var helper = require('./helper.js')

function storeOp(cmd, get){
  return function(id, data, cb){
    var self = this
    self.hasArray(id, function(err, has){
      if(!has) return cb('id not found')
      if(get) return data(null, self._data[id][cmd]() || null)
      self._data[id][cmd](data.toString())
      cb(null)
    })
  }
}

var ArrayStore = module.exports = function(){
  if(!(this instanceof ArrayStore)) return new ArrayStore()
  this._data = {}
}

ArrayStore.prototype.newArray = function(cb){
  var self = this
  helper.generateArrayId(function(err, id){
    if(err) return cb(err)
    self.hasArray(id, function(err, has){
      if(has) return cb('id already in use')
      self._data[id] = []
      cb(null, id)
    })
  })
}

ArrayStore.prototype.hasArray = function(id, cb){
  if(typeof this._data[id] === 'undefined') return cb(null, false)
  cb(null, true)
}

ArrayStore.prototype.getArray = function(id, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    cb(null, self._data[id])
  })
}

ArrayStore.prototype.removeArray = function(id, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    delete self._data[id]
    cb(null)
  })
}

ArrayStore.prototype.getStoreKeys = function(cb){
  cb(null, Object.keys(this._data))
}

ArrayStore.prototype.clearStore = function(cb){
  this._data = {}
  cb(null)
}

ArrayStore.prototype.push = storeOp('push')

ArrayStore.prototype.pop = storeOp('pop', true)

ArrayStore.prototype.unshift = storeOp('unshift')

ArrayStore.prototype.shift = storeOp('shift', true)

ArrayStore.prototype.slice = function(id, begin, end, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    cb(null, self._data[id].slice(begin, end))
  })
}

ArrayStore.prototype.indexOf = function(id, fromIndex, searchElement, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    cb(null, self._data[id].indexOf(searchElement.toString(), fromIndex))
  })
}

ArrayStore.prototype.set = function(id, index, data, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    var pi = helper.parseIndex(index, self._data[id].length)
    if(pi < 0) return cb('index out of range')
    cb(null, self._data[id].splice(pi, 1, data.toString()).pop() || null)
  })
}

ArrayStore.prototype.get = function(id, index, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    var pi = helper.parseIndex(index, self._data[id].length)
    if(pi < 0) return cb('index out of range')
    cb(null, self._data[id][pi] || null)
  })
}

ArrayStore.prototype.remove = function(id, index, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    var pi = helper.parseIndex(index, self._data[id].length)
    if(pi < 0) return cb('index out of range')
    cb(null, self._data[id].splice(index, 1).pop() || null)
  })
}
