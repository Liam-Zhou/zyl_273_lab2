
var request = require('supertest');

var chai = require('chai');
var assert = chai.assert;

describe("api test",function(){

  let url = 'http://localhost:3001'
  it('applyEvent api test',function(done){
    request(url)
    .post('/event/applyEvent')
    .set('Content-Type','application/json')
    .send({'stu_id':1,'event_id':1})
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      assert.equal(res.body, 'you have already applied');
      done();
    });
  })

  it('signup api test',function(done){
    request(url)
    .post('/signup/')
    .set('Content-Type','application/json')
    .send({'role':'student','emailId':'admin@gmail.com'})
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      assert.equal(res.body, 'email exist');
      done();
    });
  })
  
  it('getEventList api test',function(done){
    request(url)
    .get('/event/getEventList?id=1')
    .set('Content-Type','application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      assert.equal(res.body.length, 3);
      done();
    });
  })
  it('searchEvent api test',function(done){
    request(url)
    .get('/event/searchEvent?name=sjsu')
    .set('Content-Type','application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      assert.equal(res.body.length, 1);
      done();
    });
  })
  it('getJobList api test',function(done){
    request(url)
    .get('/job/getJobList?id=1')
    .set('Content-Type','application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      assert.equal(res.body.length, 2);
      done();
    });
  })


})