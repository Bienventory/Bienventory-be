const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const User = require('../lib/models/Users.js');

describe('Bienventory-be users routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('inserts a user into the users table with POST', async () => {
    const newUser = {
      google_id: '12345',
      notifications: true,
      phone_number: '+15038675309'
    };

    const res = await request(app).post('/api/v1/users').send(newUser);

    expect(res.body).toEqual(newUser);
  });

  it('gets a user by Google id', async () => {
    const newUser = {
      google_id: '12345',
      notifications: true,
      phone_number: '+15038675309'
    };
    const user = await User.insert(newUser);
    const res = await request(app).get(`/api/v1/users/${user.google_id}`);

    expect(res.body).toEqual(user);
  });

  it('updates a users notification preference with PUT', async () => {
    const newUser = {
      google_id: '12345',
      notifications: true,
      phone_number: '+15038675309'
    };
    const user = await User.insert(newUser);
    const res = await request(app)
      .put(`/api/v1/users/${user.google_id}`)
      .send({ notifications: false });

    expect(res.body).toEqual({ google_id: '12345', notifications: false, phone_number: '+15038675309' });
  });

  it('deletes a user by Google id', async () => {
    const newUser = {
      google_id: '12345',
      notifications: true,
      phone_number: '+15038675309'
    };
    const user = await User.insert(newUser);
    const res = await request(app).delete(`/api/v1/users/${user.google_id}`);

    expect(res.body).toEqual({
      message: 'user deleted'
    });
  });
});
