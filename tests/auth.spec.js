require('dotenv').config();
const request = require('supertest');
const app = require('../server');
const { sequelize, User, Organisation } = require('../models');

beforeAll(async () => {
  jest.setTimeout(30000); // Set timeout to 30 seconds
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('User Authentication and Organisation', () => {
  it('should register a user successfully with a default organisation', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '1234567890',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('should login user successfully', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('accessToken');
  });
});
