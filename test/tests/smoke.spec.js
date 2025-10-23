const { test, expect } = require('@playwright/test');

function uniqueEmail() {
  return `smoke_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
}

test('smoke: register, login, CRUD, logout (403 after logout)', async ({ request, baseURL }) => {
  const email = uniqueEmail();
  const password = 'Passw0rd!';

  // Register
  const regRes = await request.post(`${baseURL}/users/register`, {
    data: { first_name: 'Smoke', last_name: 'Test', email, password, picture: null },
  });
  expect(regRes.status()).toBe(201);
  const reg = await regRes.json();

  // Login
  const loginRes = await request.post(`${baseURL}/users/login`, {
    data: { email, password },
  });
  expect(loginRes.status()).toBe(200);
  const user = await loginRes.json();
  const token = user.token;
  const userId = user._id;
  expect(token).toBeTruthy();

  // Create
  const createRes = await request.post(`${baseURL}/todos`, {
    params: { userId },
    headers: { 'x-access-token': token },
    data: { task: 'Smoke item', completed: false, created_at: Date.now(), completed_time: null },
  });
  expect(createRes.status()).toBe(201);
  const created = await createRes.json();

  // List
  const listRes = await request.get(`${baseURL}/todos`, {
    params: { userId },
    headers: { 'x-access-token': token },
  });
  expect(listRes.ok()).toBeTruthy();
  const list = await listRes.json();
  expect(list.some((t) => t._id === created._id)).toBe(true);

  // Update
  const updateRes = await request.put(`${baseURL}/todos/${created._id}`, {
    headers: { 'x-access-token': token },
    data: { task: 'Smoke updated', completed: true, completed_time: Date.now() },
  });
  expect(updateRes.ok()).toBeTruthy();
  const updated = await updateRes.json();
  expect(updated.completed).toBe(true);

  // Delete
  const delRes = await request.delete(`${baseURL}/todos/${created._id}`, {
    headers: { 'x-access-token': token },
  });
  expect(delRes.ok()).toBeTruthy();

  // "Logout" (no endpoint), simulate by omitting token and expecting 403
  const unauthRes = await request.get(`${baseURL}/todos`, {
    params: { userId },
  });
  expect(unauthRes.status()).toBe(403);
});
