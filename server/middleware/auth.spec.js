const jwt = require('jsonwebtoken');
const auth = require('./auth');

describe('auth middleware', () => {
  afterEach(() => jest.resetAllMocks());

  const next = jest.fn();
  const buildRes = () => ({ status: jest.fn().mockReturnThis(), send: jest.fn() });

  it('responds 403 when no token provided', () => {
    const req = { body: {}, query: {}, headers: {} };
    const res = buildRes();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('A token is required for authentication');
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 401 when token invalid', () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('bad');
    });
    const req = { body: {}, query: {}, headers: { 'x-access-token': 'bad' } };
    const res = buildRes();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Invalid Token');
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next and attaches decoded when token valid', () => {
    process.env.TOKEN_KEY = 'test';
    jest.spyOn(jwt, 'verify').mockReturnValue({ user_id: 'u1', email: 'e' });
    const req = { body: {}, query: {}, headers: { 'x-access-token': 'good' } };
    const res = buildRes();

    auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('good', 'test');
    expect(req.user).toEqual({ user_id: 'u1', email: 'e' });
    expect(next).toHaveBeenCalled();
  });
});
