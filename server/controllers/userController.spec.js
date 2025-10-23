const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userController = require('./userController');

describe('userController', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('register', () => {
    it('returns 400 when required fields missing', async () => {
      const req = { body: { email: '', password: '', first_name: '', last_name: '' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await userController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('All input is required');
    });

    it('returns 409 when user already exists', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'u1', email: 'e' });
      const req = {
        body: { email: 'e@example.com', password: 'p', first_name: 'f', last_name: 'l' },
      };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await userController.register(req, res);
      expect(User.findOne).toHaveBeenCalledWith({ email: 'e@example.com' });
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalledWith('User Already Exist. Please Login');
    });

    it('creates user and returns 201 with token', async () => {
      process.env.TOKEN_KEY = 'test';
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed');
      const created = {
        _id: 'u1',
        first_name: 'f',
        last_name: 'l',
        email: 'e@example.com',
        password: 'hashed',
        picture: null,
      };
      jest.spyOn(User, 'create').mockResolvedValue(created);
      jest.spyOn(jwt, 'sign').mockReturnValue('token');

      const req = {
        body: { email: 'e@example.com', password: 'p', first_name: 'f', last_name: 'l', picture: null },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await userController.register(req, res);
      expect(User.create).toHaveBeenCalledWith({
        first_name: 'f',
        last_name: 'l',
        email: 'e@example.com',
        password: 'hashed',
        picture: null,
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { user_id: 'u1', email: 'e@example.com' },
        'test',
        { expiresIn: '2h' },
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ user: created, token: 'token' });
    });

    it('handles server error', async () => {
      jest.spyOn(User, 'findOne').mockRejectedValue(new Error('db'));
      const req = { body: { email: 'e', password: 'p', first_name: 'f', last_name: 'l' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await userController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Server error');
    });
  });

  describe('login', () => {
    it('returns 400 when email or password missing', async () => {
      const req = { body: { email: '', password: '' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await userController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('All input is required');
    });

    it('returns user with token on success', async () => {
      process.env.TOKEN_KEY = 'test';
      const user = { _id: 'u1', email: 'e@example.com', password: 'hashed' };
      jest.spyOn(User, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwt, 'sign').mockReturnValue('token');

      const req = { body: { email: 'e@example.com', password: 'p' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };

      await userController.login(req, res);
      expect(User.findOne).toHaveBeenCalledWith({ email: 'e@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('p', 'hashed');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ...user, token: 'token' });
    });

    it('returns 400 on invalid credentials', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      const req = { body: { email: 'e@example.com', password: 'p' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await userController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Invalid Credentials');
    });
  });
});
