'use strict'

var crypto = require('crypto')
var base32 = require('base32')

var ArrayStore = module.exports = function(){
  if(!(this instanceof ArrayStore)) return new ArrayStore()
  this._data = {}
}

ArrayStore.prototype.newArray = function(cb){
  var self = this
  crypto.randomBytes(10, function(err, buf) {
    if (err) return cb(err)
    var id = base32.encode(buf)
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

ArrayStore.prototype.push = function(id, data, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    self._data[id].push(data.toString())
    cb(null)
  })
}

ArrayStore.prototype.pop = function(id, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    cb(null, self._data[id].pop() || null)
  })
}

ArrayStore.prototype.unshift = function(id, data, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    self._data[id].unshift(data.toString())
    cb(null)
  })
}

ArrayStore.prototype.shift = function(id, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    cb(null, self._data[id].shift() || null)
  })
}

ArrayStore.prototype.slice = function(id, begin, end, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    cb(null, self._data[id].slice(begin, end))
  })
}

ArrayStore.prototype.indexOf = function(id, searchElement, fromIndex, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    cb(null, self._data[id].indexOf(searchElement, fromIndex))
  })
}

ArrayStore.prototype.set = function(id, index, data, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    cb(null, self._data[id].splice(index, 1, data).pop() || null)
  })
}

ArrayStore.prototype.get = function(id, index, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    var pi = parseInt(index, 10)
    if(isNaN(pi) || pi >= self._data[id].length) return cb(null, null)
    if(pi < 0) pi += self._data[id].length
    if(pi < 0) pi = 0
    cb(null, self._data[id][pi] || null)
  })
}

ArrayStore.prototype.remove = function(id, index, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(!has) return cb('id not found')
    cb(null, self._data[id].splice(index, 1).pop() || null)
  })
}
