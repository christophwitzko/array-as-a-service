'use strict'

function doTest(name, store){
  var as = store()
  var tid = ''
  describe('#' + name + '()', function(){
    describe('#newArray()', function(){
      it('should create a new array', function(done){
        as.newArray(function(err, id){
          (err === null).should.be.true
          id.length.should.equal(16)
          tid = id
          done()
        })
      })
    })
    describe('#getArray()', function(){
      it('should get array', function(done){
        as.getArray(tid, function(err, data){
          (err === null).should.be.true
          data.length.should.equal(0)
          done()
        })
      })
    })
    describe('#setArray()', function(){
      it('should set array', function(done){
        as.setArray(tid, ['123'], function(err){
          as.getArray(tid, function(err, data){
            (err === null).should.be.true
            data.length.should.equal(1)
            done()
          })
        })
      })
    })
    describe('#removeArray()', function(){
      it('should remove array', function(done){
        as.newArray(function(err, id){
          (err === null).should.be.true
          id.length.should.equal(16)
          as.removeArray(id, function(err){
            (err === null).should.be.true
            done()
          })
        })
      })
    })
    describe('#getStore()', function(){
      it('should get store', function(done){
        as.getStore(function(err, data){
          (err === null).should.be.true
          data.should.not.be.empty
          done()
        })
      })
    })
    describe('#getStoreKeys()', function(){
      it('should get store keys', function(done){
        as.getStoreKeys(function(err, data){
          (err === null).should.be.true
          data.length.should.equal(1)
          done()
        })
      })
    })
    describe('#clearStore()', function(){
      it('should clear store', function(done){
        as.clearStore(function(err){
          (err === null).should.be.true
          as.getStore(function(err, data){
            (err === null).should.be.true
            data.should.be.empty
            done()
          })
        })
      })
    })
    describe('#ArrayOperations', function(){
      var aid = ''
      before(function(done) {
        as.newArray(function(err, id){
          aid = id
          done()
        })
      })
      describe('#push()', function(){
        it('should push data on the array', function(done){
          as.push(aid, 'test0', function(err){
            as.push(aid, 'test1', function(err){
              as.getArray(aid, function(err, data){
                (err === null).should.be.true
                data.length.should.equal(2)
                data[0].should.equal('test0')
                data[1].should.equal('test1')
                done()
              })
            })
          })
        })
      })
      describe('#pop()', function(){
        it('should pop data from the array', function(done){
          as.pop(aid, function(err, data){
            (err === null).should.be.true
            data.should.equal('test1')
            done()
          })
        })
      })
      describe('#unshift()', function(){
        it('should unshift data on the array', function(done){
          as.unshift(aid, 'test2', function(err){
            as.getArray(aid, function(err, data){
              (err === null).should.be.true
              data.length.should.equal(2)
              data[0].should.equal('test2')
              data[1].should.equal('test0')
              done()
            })
          })
        })
      })
      describe('#shift()', function(){
        it('should shift data from the array', function(done){
          as.shift(aid, function(err, data){
            (err === null).should.be.true
            data.should.equal('test2')
            as.shift(aid, function(err, data){
              (err === null).should.be.true
              data.should.equal('test0')
              done()
            })
          })
        })
      })
    })
   
  })
}

var stores = require('../stores')

Object.keys(stores).forEach(function(v){
  doTest(v, stores[v])
})
