'use strict'

var crypto = require('crypto')
var base32 = require('base32')
var redis = require('redis')
var parallizer = require('parallizer')

var ArrayStore = module.exports = function(){
  if(!(this instanceof ArrayStore)) return new ArrayStore()
  this._prefix = 'aaas'
  this._idset = this._prefix + ':idset'
  this._client = redis.createClient()
}

ArrayStore.prototype.newArray = function(cb){
  var self = this
  crypto.randomBytes(10, function(err, buf) {
    if(err) return cb(err)
    var id = base32.encode(buf)
    self.hasArray(id, function(err, has){
      if(err) return cb(err)
      self._client.sadd(self._idset, id, function(err, reply){
        if(err) return cb(err)
        cb(null, id)
      })
    })
  })
}

ArrayStore.prototype.hasArray = function(id, cb){
  this._client.sismember(this._idset, id, function(err, reply){
    if(err) return cb(err)
    cb(null, !!reply)
  })
}

ArrayStore.prototype.getArray = function(id, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(err) return cb(err)
    if(!has) return cb('id not found')
    self._client.lrange(self._prefix + ':' + id, 0, -1, cb)
  })
}

ArrayStore.prototype.removeArray = function(id, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(err) return cb(err)
    if(!has) return cb('id not found')
    self._client.srem(self._idset, id, function(err, reply){
      self._client.del(self._prefix + ':' + id, function(err, reply){
        cb(err)
      })
    })
  })
}

ArrayStore.prototype.getStoreKeys = function(cb){
  this._client.smembers(this._idset, cb)
}

ArrayStore.prototype.clearStore = function(cb){
  var self = this
  var prl = parallizer.Parallel(1, function(){
    cb(null)
  })
  self._client.keys(self._prefix + ':*', function(err, keys){
    if(err) return cb(err)
    if(keys.length === 0) return cb(null)
    keys.forEach(function(k){
      prl.sadd(self._client.del.bind(self._client), k)
    })
  })
}

ArrayStore.prototype.push = function(id, data, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(err) return cb(err)
    if(!has) return cb('id not found')
    self._client.rpush(self._prefix + ':' + id, data.toString(), function(err, reply){
      if(err) return cb(err)
      cb(null)
    })
  })
}

ArrayStore.prototype.pop = function(id, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(err) return cb(err)
    if(!has) return cb('id not found')
    self._client.rpop(self._prefix + ':' + id, function(err, data){
      if(err) return cb(err)
      cb(null, data)
    })
  })
}

ArrayStore.prototype.unshift = function(id, data, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(err) return cb(err)
    if(!has) return cb('id not found')
    self._client.lpush(self._prefix + ':' + id, data.toString(), function(err, reply){
      if(err) return cb(err)
      cb(null)
    })
  })
}

ArrayStore.prototype.shift = function(id, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(err) return cb(err)
    if(!has) return cb('id not found')
    self._client.lpop(self._prefix + ':' + id, function(err, data){
      if(err) return cb(err)
      cb(null, data)
    })
  })
}

ArrayStore.prototype.slice = function(id, begin, end, cb){
  var self = this
  self.hasArray(id, function(err, has){
    if(err) return cb(err)
    if(!has) return cb('id not found')
    self._client.lrange(self._prefix + ':' + id, begin || 0, (end || 0) - 1, cb)
  })
}

ArrayStore.prototype.indexOf = function(id, searchElement, fromIndex, cb){
  var self = this
  self.getArray(id, function(err, data){
    if(err) return cb(err)
    cb(null, data.indexOf(searchElement, fromIndex))
  })
}
