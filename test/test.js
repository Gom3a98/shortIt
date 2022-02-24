var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3001");

// UNIT test begin

describe("SAMPLE unit test",function(){

  // #1 should return home page  T#1

  it("should return shorter url",function(done){

    // calling home page api
    server
    .post("/url")
    .send({
      url : "https://codeforgeek.com/unit-testing-nodejs-application-using-mocha/"
    })
    .end(function(err,res){
      res.error.should.equal(false);
      done();
    });
  });

});