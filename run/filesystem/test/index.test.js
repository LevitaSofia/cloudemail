const path = require('path');
const supertest = require('supertest');

const app = require(path.join(__dirname, '..', 'index'))
describe('Unit tests', () => {
  describe('GET /', () => {
    it('responds with 200 OK', function () {
      supertest(app)
        .get('/')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
        });
    });
  });
});