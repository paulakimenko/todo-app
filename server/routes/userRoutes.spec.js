const express = require('express');
const request = require('supertest');

// Mock controllers to isolate routing behavior
const mockRegister = jest.fn((req, res) => res.status(201).json({ ok: true, action: 'register' }));
const mockLogin = jest.fn((req, res) => res.status(200).json({ ok: true, action: 'login' }));

jest.mock('../controllers/userController', () => ({
  register: (req, res) => mockRegister(req, res),
  login: (req, res) => mockLogin(req, res),
}));

describe('userRoutes', () => {
  const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/api/users', require('./userRoutes'));
    return app;
  };

  afterEach(() => {
    mockRegister.mockClear();
    mockLogin.mockClear();
  });

  it('POST /api/users/register routes to userController.register and returns 201', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/users/register')
      .send({ email: 'e@example.com', password: 'p', first_name: 'f', last_name: 'l' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true, action: 'register' });
  expect(mockRegister).toHaveBeenCalled();
  });

  it('POST /api/users/login routes to userController.login and returns 200', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'e@example.com', password: 'p' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, action: 'login' });
  expect(mockLogin).toHaveBeenCalled();
  });
});
