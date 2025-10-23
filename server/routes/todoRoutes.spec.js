const express = require('express');
const request = require('supertest');

// We keep a mutable mock for auth so tests can change behavior
const mockAuth = jest.fn((req, res, next) => next());
jest.mock('../middleware/auth', () => mockAuth);

const mockGetAllTodos = jest.fn((req, res) => res.status(200).json([{ _id: '1', task: 'T1' }]));
const mockCreateTodo = jest.fn((req, res) => res.status(201).json({ _id: '2', task: 'T2' }));
const mockUpdateTodo = jest.fn((req, res) => res.status(200).json({ _id: '1', task: 'U' }));
const mockDeleteTodo = jest.fn((req, res) => res.status(200).json({ message: 'deleted' }));
const mockDeleteAllTodos = jest.fn((req, res) => res.status(200).json({ message: 'all deleted' }));

jest.mock('../controllers/todoController', () => ({
  getAllTodos: (req, res) => mockGetAllTodos(req, res),
  createTodo: (req, res) => mockCreateTodo(req, res),
  updateTodo: (req, res) => mockUpdateTodo(req, res),
  deleteTodo: (req, res) => mockDeleteTodo(req, res),
  deleteAllTodos: (req, res) => mockDeleteAllTodos(req, res),
}));

describe('todoRoutes', () => {
  const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/api/todos', require('./todoRoutes'));
    return app;
  };

  beforeEach(() => {
    mockAuth.mockImplementation((req, res, next) => next());
    mockGetAllTodos.mockClear();
    mockCreateTodo.mockClear();
    mockUpdateTodo.mockClear();
    mockDeleteTodo.mockClear();
    mockDeleteAllTodos.mockClear();
  });

  it('GET /api/todos calls getAllTodos when auth passes', async () => {
    const app = buildApp();
    const res = await request(app)
      .get('/api/todos?userId=u1')
      .set('x-access-token', 'token');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ _id: '1', task: 'T1' }]);
  expect(mockGetAllTodos).toHaveBeenCalled();
  });

  it('POST /api/todos calls createTodo and returns 201 when auth passes', async () => {
    const app = buildApp();
    const res = await request(app)
      .post('/api/todos?userId=u1')
      .set('x-access-token', 'token')
      .send({ task: 'x' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ _id: '2', task: 'T2' });
  expect(mockCreateTodo).toHaveBeenCalled();
  });

  it('blocks with 403 when auth denies', async () => {
  mockAuth.mockImplementation((req, res) => res.status(403).send('A token is required for authentication'));
    const app = buildApp();
    const res = await request(app).get('/api/todos?userId=u1');
    expect(res.status).toBe(403);
  expect(mockGetAllTodos).not.toHaveBeenCalled();
  });
});
