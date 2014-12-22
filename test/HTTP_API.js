'use strict'

var request = require('supertest')
var express = require('express')
var app = express()
var store = require('../stores').Redis()
require('../routes')(app, store)

describe('#HTTP_API', function(){
  var aid = ''
  describe('POST /new', function(){
    it('generate new array', function(done){
      request(app)
        .post('/new')
        .expect(200, /id/)
        .end(function(err, res){
          (err === null).should.be.true
          aid = res.body.id
          done()
        })
    })
  })
  describe('POST /:id/push', function(){
    it('push data to array', function(done){
      request(app)
        .post('/' + aid + '/push')
        .type('text/plain')
        .send('test1')
        .expect(200, /"error":null/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('push empty data to array', function(done){
      request(app)
        .post('/' + aid + '/push')
        .type('text/plain')
        .expect(200, /no data/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('push more data to array', function(done){
      request(app)
        .post('/' + aid + '/push')
        .type('text/plain')
        .send('test2')
        .expect(200, /"error":null/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
  })
  describe('POST /:id/unshift', function(){
    it('unshift data to array', function(done){
      request(app)
        .post('/' + aid + '/unshift')
        .type('text/plain')
        .send('test0')
        .expect(200, /"error":null/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('unshift empty data to array', function(done){
      request(app)
        .post('/' + aid + '/unshift')
        .type('text/plain')
        .expect(200, /no data/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
  })
  describe('GET /:id/pop', function(){
    it('pop data from array', function(done){
      request(app)
        .get('/' + aid + '/pop')
        .expect(200, /"data":"test2"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
  })
  describe('GET /:id/shift', function(){
    it('pop data from array', function(done){
      request(app)
        .get('/' + aid + '/shift')
        .expect(200, /"data":"test0"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
  })
  describe('GET /:id', function(){
    it('get a array by id', function(done){
      request(app)
        .get('/' + aid)
        .expect(200, /"data":\["test1"\]/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('use invalid id', function(done){
      request(app)
        .get('/asd')
        .expect(200, /invalid id/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('use wrong id', function(done){
      request(app)
        .get('/wb60kgt66wq5aqxk')
        .expect(200, /id not found/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
  })
  describe('DELETE /:id', function(){
    it('delete array', function(done){
      request(app)
        .delete('/' + aid)
        .expect(200, /"error":null/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('array has been removed', function(done){
      request(app)
        .get('/' + aid)
        .expect(200, /id not found/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
  })
})
