const path = require('path');
const supertest = require('supertest');
const assert = require('chai').expect;

let request;
describe('Unit tests', () => {
  before(() => {
    const app = require(path.join(__dirname, '..', 'index'));
    request = supertest(app);
  });
  describe('GET /', () => {
    it('responds with 200 OK', async () => {
      response = await request.get('/');
      assert(response.status).to.eql(200);
    });
  });
  describe('GET nonexistant path', () => {
    it('responds with 404 Not Found', async () => {
      response = await request.get('/nonexistant');
      assert(response.status).to.eql(404);
    });
  });
});