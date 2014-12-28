'use strict'

var crypto = require('crypto')
var url = require('url')

var base32 = require('base32')
var redis = require('redis')
var uuid = require('node-uuid')

module.exports = {
  generateArrayId: function(cb){
    crypto.randomBytes(10, function(err, buf){
      if(err) return cb(err)
      cb(null, base32.encode(buf))
    })
  },
  generateUuid: function(){
    return uuid.v4()
  },
  parseIndex: function(index, length){
    var pi = parseInt(index, 10)
    if(isNaN(pi) || (pi < 0 ? (Math.abs(pi) > length) : (pi >= length))) return -1
    if(pi < 0) pi += length
    return pi
  },
  parseRedisUrl: function(redisUrl){
    var parsedUrl = url.parse(redisUrl || 'redis://localhost:6379')
    var parsedAuth = (parsedUrl.auth || '').split(':')
    return redis.createClient(parsedUrl.port, parsedUrl.hostname, {auth_pass: parsedAuth[1] || null})
  }
}
