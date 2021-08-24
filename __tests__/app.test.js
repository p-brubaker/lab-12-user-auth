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
    }, 20000);
    
    afterAll(done => {
      return client.end(done);
    });

    test('adds an item to todos', async() => {
      const todo = {
        todo: 'water the plants',
        completed: false,
        user_id: 1
      };

      const data = await fakeRequest(app)
        .post('/api/todos')
        .send(todo)
        .set('Authorization', token)
        .expect('Content-Type', /application\/json/)
        .expect(200);

      expect(data.body[0]).toEqual(
        {
          id: 1,
          todo: 'water the plants',
          completed: false,
          user_id: 1
        }
      );
    });

    test('gets a users todos', async() => {
      const expectation = [{
        id: 1,
        todo: 'water the plants',
        completed: false,
        user_id: 1
      }];

      const data = await fakeRequest(app)
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(data.body).toEqual(expectation);
    });
  
    test('updates an id', async() => {
      const expectation = [{
        id: 1,
        todo: 'water the plants',
        completed: true,
        user_id: 1
      }];

      const data = await fakeRequest(app)
        .put('/api/todos/1')
        .send(expectation)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


  });
});
