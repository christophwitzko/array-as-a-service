'use strict'

var request = require('supertest')
var express = require('express')
var parallizer = require('parallizer')
var app = express()
var store = require('../stores').Redis()
require('../routes')(app, store)

var testArray = ['a', 'b', 'c', 'd', 'c']

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
  describe('POST /:id/indexof[/:index]', function(){
    before(function(done){
      var prl = parallizer.Parallel(1, done)
      testArray.forEach(function(v){
        prl.sadd(store.unshift.bind(store, aid), v, function(err){
          (err === null).should.be.true
        })
      })
    })
    it('sould find index', function(done){
      request(app)
        .post('/' + aid  + '/indexof')
        .type('text/plain')
        .send('c')
        .expect(200, /"index":0/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('sould find index (fromIndex)', function(done){
      request(app)
        .post('/' + aid  + '/indexof/1')
        .type('text/plain')
        .send('c')
        .expect(200, /"index":2/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('sould not find index', function(done){
      request(app)
        .post('/' + aid  + '/indexof')
        .type('text/plain')
        .send('test')
        .expect(200, /"index":-1/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('sould not find index (fromIndex)', function(done){
      request(app)
        .post('/' + aid  + '/indexof/2')
        .type('text/plain')
        .send('d')
        .expect(200, /"index":-1/)
        .end(function(err, res){
          ;(err === null).should.be.true
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
