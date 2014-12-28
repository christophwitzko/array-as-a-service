'use strict'

var request = require('supertest')
var express = require('express')
var parallizer = require('parallizer')
var app = express()
var store = require('../stores').Redis()
require('../routes')(app, store)

var testArray = ['a', 'b', 'c', 'd', 'c']
var authKey = 'YWRtaW46MTIzNDU2'

describe('#HTTP_API', function(){
  var aid = ''
  describe('POST /', function(){
    it('generate new array', function(done){
      request(app)
        .post('/')
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
        .expect(200, /"error":"no data"/)
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
        .expect(200, /"error":"no data"/)
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
        .expect(200, /"error":"invalid id"/)
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
    it('find index', function(done){
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
    it('find index (fromIndex)', function(done){
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
    it('not find index', function(done){
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
    it('not find index (fromIndex)', function(done){
      request(app)
        .post('/' + aid  + '/indexof/2')
        .type('text/plain')
        .send('d')
        .expect(200, /"index":-1/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
  })
  describe('POST /:id/:index', function(){
    it('set value at index (1)', function(done){
      request(app)
        .post('/' + aid  + '/0')
        .type('text/plain')
        .send('A')
        .expect(200, /"error":null/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('set value at index (2)', function(done){
      request(app)
        .post('/' + aid  + '/-1')
        .type('text/plain')
        .send('Z')
        .expect(200, /"error":null/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('set value at index (3)', function(done){
      request(app)
        .post('/' + aid  + '/100')
        .type('text/plain')
        .send('A')
        .expect(200, /"error":"index out of range"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('set value at index (4)', function(done){
      request(app)
        .post('/' + aid + '/asd')
        .type('text/plain')
        .send('A')
        .expect(200, /"error":"invalid index"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
  })
  describe('GET /:id/:index', function(){
    it('get value at index (1)', function(done){
      request(app)
        .get('/' + aid  + '/1')
        .expect(200, /"data":"d"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('get value at index (2)', function(done){
      request(app)
        .get('/' + aid  + '/100')
        .expect(200, /"error":"index out of range"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('get value at index (3)', function(done){
      request(app)
        .get('/' + aid  + '/-1')
        .expect(200, /"data":"Z"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('get value at index (4)', function(done){
      request(app)
        .get('/' + aid + '/asd')
        .expect(200, /"error":"invalid index"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
  })
  describe('GET /:id/:begin/:end', function(){
    it('get slice from array (1)', function(done){
      request(app)
        .get('/' + aid  + '/0/-3')
        .expect(200, /"data":\["A","d","c"\]/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('get slice from array (2)', function(done){
      request(app)
        .get('/' + aid  + '/0/asd')
        .expect(200, /"error":"invalid begin or end"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('get slice from array (3)', function(done){
      request(app)
        .get('/' + aid  + '/3/4')
        .expect(200, /"data":\["b"\]/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
})
  describe('DELETE /:id/:index', function(){
    it('remove value at index (1)', function(done){
      request(app)
        .delete('/' + aid + '/0')
        .expect(200, /"data":"A"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('remove value at index (2)', function(done){
      request(app)
        .delete('/' + aid  + '/100')
        .expect(200, /"error":"index out of range"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('remove value at index (3)', function(done){
      request(app)
        .delete('/' + aid + '/-3')
        .expect(200, /"data":"b"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('remove value at index (4)', function(done){
      request(app)
        .delete('/' + aid + '/2')
        .expect(200, /"data":"a"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('remove value at index (5)', function(done){
      request(app)
        .delete('/' + aid + '/asd')
        .expect(200, /"error":"invalid index"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('check array', function(done){
      request(app)
        .get('/' + aid)
        .expect(200, /"data":\["d","c","Z"\]/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
  })
  describe('GET /', function(){
    it('get store (unauthorized)', function(done){
      request(app)
        .get('/')
        .expect(401)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('get store', function(done){
      request(app)
        .get('/')
        .set('Authorization', 'Basic ' + authKey)
        .expect(200)
        .end(function(err, res){
          (!!~res.body.keys.indexOf(aid)).should.be.true
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
        .expect(200, /"error":"id not found"/)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
  })
  describe('DELETE /', function(){
    before(function(done){
      store.newArray(function(err, id){
        (err === null).should.be.true
        done()
      })
    })
    it('delete store (unauthorized)', function(done){
      request(app)
        .delete('/')
        .expect(401)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('delete store', function(done){
      request(app)
        .delete('/')
        .set('Authorization', 'Basic ' + authKey)
        .end(function(err, res){
          (err === null).should.be.true
          done()
        })
    })
    it('check store', function(done){
      request(app)
        .get('/')
        .set('Authorization', 'Basic ' + authKey)
        .expect(200)
        .end(function(err, res){
          res.body.keys.length.should.be.equal(0)
          ;(err === null).should.be.true
          done()
        })
    })
  })
})
