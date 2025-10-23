# Todo App - Server

Express API with MongoDB and JWT auth. Used by the React client.

## Run

- Install deps and start (dev):
    - `npm install`
    - `npm run dev` (nodemon on http://localhost:8080)

## Environment

- Required variables:
    - `MONGO_DB_URL` — Mongo connection string
    - `TOKEN_KEY` — JWT secret used to sign tokens

## Auth and headers

- Auth header: `x-access-token: <token>`
- For list and bulk-delete, pass `?userId=<id>` query to scope data.

## Endpoints

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/todos?userId=...` (auth)
- `POST /api/todos?userId=...` (auth)
- `PUT /api/todos/:id` (auth)
- `DELETE /api/todos/:id` (auth)
- `DELETE /api/todos/delete/all?userId=...` (auth)

## Tests

- Jest unit and route tests:
    - `npm test` (or via repo root: `make unit-test`)

## Structure

- `controllers/` — `todoController.js`, `userController.js`
- `models/` — `Todo.js`, `User.js`
- `routes/` — `todoRoutes.js`, `userRoutes.js`
- `middleware/` — `auth.js`
- `index.js` — app entry
