const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server } = require("../app");

chai.use(chaiHttp);
chai.should();

describe("People", () => {
  after(() => {
    server.close();
  });
  describe("post /api/v1/people", () => {
    it("should not create a people entry without a name", (done) => {
      chai
        .request(app)
        .post("/api/v1/people")
        .send({ age: 10 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.eql({ error: "Please enter a name." });
          done();
        });
    });
    it("should create a people entry with valid input", (done) => {
      chai
        .request(app)
        .post("/api/v1/people")
        .send({ name: "Link", age: 117 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.include({ msg: "A person record was added." });
          this.lastIndex = res.body.index;
        });
      done();
    });
  });
  describe("get /api/v1/people", () => {
    it(`should return an array of person entries of length ${
      this.lastIndex + 1
    }`, (done) => {
      chai
        .request(app)
        .get("/api/v1/people")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.people.should.be.an("array").with.length(this.lastIndex + 1);
        });
      done();
    });
  });
  describe("get /api/v1/people/:id", () => {
    it("should return the entry corresponding to the last person added.", (done) => {
      // your code goes here
      chai
        .request(app)
        .get(`/api/v1/people/${this.lastIndex}`)
        .end((err, res) => {
          res.should.have.status(200);
          console.log(res.body);
          res.body.person.name.should.be.eql("Link");
        });
      done();
    });
    it("should return an error if the index is >= the length of the array", (done) => {
      chai
        .request(app)
        .get("/api/v1/people/500")
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.eql({
            msg: "A person with that ID does not exist.",
          });
        });
      done();
    });
  });
});
