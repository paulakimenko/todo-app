const { test, expect } = require('@playwright/test');

function uniqueEmail() {
  return `tester_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
}

async function register(request, baseURL, email, password = 'Passw0rd!') {
  const res = await request.post(`${baseURL}/users/register`, {
    data: {
      first_name: 'Test',
      last_name: 'User',
      email,
      password,
      picture: null,
    },
  });
  expect(res.status()).toBe(201);
  const json = await res.json();
  expect(json).toHaveProperty('user._id');
  expect(json).toHaveProperty('token');
  return json;
}

async function login(request, baseURL, email, password = 'Passw0rd!') {
  const res = await request.post(`${baseURL}/users/login`, {
    data: { email, password },
  });
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json).toHaveProperty('_id');
  expect(json).toHaveProperty('token');
  return json;
}

async function createTodo(request, baseURL, token, userId, task) {
  const res = await request.post(`${baseURL}/todos`, {
    params: { userId },
    headers: { 'x-access-token': token },
    data: { task, completed: false, created_at: Date.now(), completed_time: null },
  });
  expect(res.status()).toBe(201);
  const json = await res.json();
  expect(json).toHaveProperty('_id');
  expect(json.task).toBe(task);
  return json;
}

async function listTodos(request, baseURL, token, userId) {
  const res = await request.get(`${baseURL}/todos`, {
    params: { userId },
    headers: { 'x-access-token': token },
  });
  expect(res.ok()).toBeTruthy();
  return res.json();
}

async function updateTodo(request, baseURL, token, id, body) {
  const res = await request.put(`${baseURL}/todos/${id}`, {
    headers: { 'x-access-token': token },
    data: body,
  });
  expect(res.ok()).toBeTruthy();
  return res.json();
}

async function deleteTodo(request, baseURL, token, id) {
  const res = await request.delete(`${baseURL}/todos/${id}`, {
    headers: { 'x-access-token': token },
  });
  expect(res.ok()).toBeTruthy();
  return res.json();
}

async function deleteAllTodos(request, baseURL, token, userId) {
  const res = await request.delete(`${baseURL}/todos/delete/all`, {
    params: { userId },
    headers: { 'x-access-token': token },
  });
  expect(res.ok()).toBeTruthy();
  return res.json();
}

// Full CRUD API flow
// Requires server running at API_BASE_URL

test('CRUD API: register -> login -> create/list/update/delete -> delete all', async ({ request, baseURL }) => {
  const email = uniqueEmail();
  const password = 'Passw0rd!';

  // register and login
  const reg = await register(request, baseURL, email, password);
  const userId = reg.user._id;
  const tokenFromRegister = reg.token;
  expect(tokenFromRegister).toBeTruthy();

  const loggedIn = await login(request, baseURL, email, password);
  const token = loggedIn.token;
  expect(token).toBeTruthy();
  expect(loggedIn._id).toBe(userId);

  // create
  const todo = await createTodo(request, baseURL, token, userId, 'Write E2E tests');

  // list
  const list1 = await listTodos(request, baseURL, token, userId);
  expect(Array.isArray(list1)).toBe(true);
  expect(list1.find((t) => t._id === todo._id)).toBeTruthy();

  // update
  const updated = await updateTodo(request, baseURL, token, todo._id, {
    task: 'Write more tests',
    completed: true,
    completed_time: Date.now(),
  });
  expect(updated.completed).toBe(true);
  expect(updated.task).toBe('Write more tests');

  // delete
  const del = await deleteTodo(request, baseURL, token, todo._id);
  expect(del).toHaveProperty('message');

  // delete all (should succeed even if list empty)
  const delAll = await deleteAllTodos(request, baseURL, token, userId);
  expect(delAll).toHaveProperty('status', 200);
});
