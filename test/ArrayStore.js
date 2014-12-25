'use strict'

var parallizer = require('parallizer')

var testArray = ['a', 'b', 'c', 'd', 'e']

function doTest(name, store){
  var as = store()
  var tid = ''
  before(function(done) {
    as.clearStore(done)
  })
  describe('#' + name, function(){
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
          as.getStoreKeys(function(err, data){
            (err === null).should.be.true
            data.length.should.equal(0)
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
            as.pop(aid, function(err, data){
              (err === null).should.be.true
              data.should.equal('test0')
              done()
            })
          })
        })
      })
      describe('#unshift()', function(){
        it('should unshift data on the array', function(done){
          as.unshift(aid, 'test2', function(err){
            as.getArray(aid, function(err, data){
              (err === null).should.be.true
              data.length.should.equal(1)
              data[0].should.equal('test2')
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
              ;(data === null).should.be.true
              done()
            })
          })
        })
      })
      describe('#slice()', function(){
        before(function(done) {
          var prl = parallizer.Parallel(1, done)
          testArray.forEach(function(v){
            prl.sadd(as.push.bind(as, aid), v, function(err){
              (err === null).should.be.true
            })
          })
        })
        it('should slice array (1)', function(done){
          as.slice(aid, undefined, undefined, function(err, data){
            (err === null).should.be.true
            data.should.eql(testArray)
            done()
          })
        })
        it('should slice array (2)', function(done){
          as.slice(aid, 1, 2, function(err, data){
            (err === null).should.be.true
            data.should.eql(['b'])
            done()
          })
        })
        it('should slice array (3)', function(done){
          as.slice(aid, 3, 100, function(err, data){
            (err === null).should.be.true
            data.should.eql(['d', 'e'])
            done()
          })
        })
        it('should slice array (4)', function(done){
          as.slice(aid, 2, -2, function(err, data){
            (err === null).should.be.true
            data.should.eql(['c'])
            done()
          })
        })
        it('should slice array (5)', function(done){
          as.slice(aid, -3, 4, function(err, data){
            (err === null).should.be.true
            data.should.eql(['c', 'd'])
            done()
          })
        })
        it('should slice array (6)', function(done){
          as.slice(aid, '0', '1', function(err, data){
            (err === null).should.be.true
            data.should.eql(['a'])
            done()
          })
        })
      })
      describe('#indexOf()', function(){
        it('should get index of element in array', function(done){
          as.indexOf(aid, 'a', undefined, function(err, data){
            (err === null).should.be.true
            data.should.eql(0)
            done()
          })
        })
        it('should get index of element not in array', function(done){
          as.indexOf(aid, 'z', undefined, function(err, data){
            (err === null).should.be.true
            data.should.equal(-1)
            done()
          })
        })
        it('should get index of element in array with fromIndex (1)', function(done){
          as.indexOf(aid, 'a', 1, function(err, data){
            (err === null).should.be.true
            data.should.equal(-1)
            done()
          })
        })
        it('should get index of element in array with fromIndex (2)', function(done){
          as.indexOf(aid, 'e', 3, function(err, data){
            (err === null).should.be.true
            data.should.equal(4)
            done()
          })
        })
      })
    })
   
  })
}

var stores = require('../stores')

describe('#ArrayStore', function(){
  Object.keys(stores).forEach(function(v){
    doTest(v, stores[v])
  })
})
