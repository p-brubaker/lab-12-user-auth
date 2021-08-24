require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signin')
        .send({
          email: 'john@arbuckle.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 15000);

    test('adds an item to todos', async() => {
      const todo = {
        todo: 'water plants',
        completed: false,
        user_id: 1
      };

      const data = await fakeRequest(app)
        .post('/api/todos')
        .send(todo)
        .set('Authorization', token)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.todo).toEqual('water plants');
      expect(data.body.completed).toEqual(false);
      expect(data.body.user_id).toEqual(1);
    });
  
    afterAll(done => {
      return client.end(done);
    });

    // test('returns animals', async() => {

    //   const expectation = [
    //     {
    //       'id': 1,
    //       'name': 'bessie',
    //       'cool_factor': 3,
    //       'owner_id': 1
    //     },
    //     {
    //       'id': 2,
    //       'name': 'jumpy',
    //       'cool_factor': 4,
    //       'owner_id': 1
    //     },
    //     {
    //       'id': 3,
    //       'name': 'spot',
    //       'cool_factor': 10,
    //       'owner_id': 1
    //     }
    //   ];

    //   const data = await fakeRequest(app)
    //     .get('/animals')
    //     .expect('Content-Type', /json/)
    //     .expect(200);

    //   expect(data.body).toEqual(expectation);
    // });
  });
});
