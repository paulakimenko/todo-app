# Copilot instructions for this repo (todo-app)

These notes teach AI coding agents how to be instantly effective in this MERN app. Keep answers concrete, reference real files, and follow these project-specific patterns.

## Big picture and data flow
- Two apps in one repo: React client (`client/`) and Express/Mongo API (`server/`). Client calls server over HTTPS; no monorepo tooling.
- Auth: JWT via custom header `x-access-token` checked by `server/middleware/auth.js`. Tokens are issued in `server/controllers/userController.js` and must be provided on all `/api/todos` requests.
- Multi-tenant by userId: client passes `userId` as a query string for list and bulk-delete (`GET /api/todos?userId=...`, `DELETE /api/todos/delete/all?userId=...`).
- Data model: `server/models/Todo.js` with fields `{ task, userId, completed, completed_time, created_at }`. Client sets/clears `completed_time` in `client/src/Services/api.js` before updates.

## API surface (server)
- Users: `POST /api/users/register`, `POST /api/users/login` (see `server/controllers/userController.js`). Login returns a full user document including `token`; register returns `{ user, token }`.
- Todos (all require auth middleware):
  - `GET /api/todos?userId=` → list
  - `POST /api/todos?userId=` → create
  - `PUT /api/todos/:id` → update body `{ task, completed, completed_time }`
  - `DELETE /api/todos/:id` → delete one
  - `DELETE /api/todos/delete/all?userId=` → delete all for user
- Routing is in `server/routes/*.js`. Attach new endpoints there and include `auth` where needed.

## Client patterns
- State: single Redux slice at `client/src/Store/userSlice.js` with `{ user, userId, token, picture }`. Configure store in `client/src/Store/store.js`.
- API access: centralized in `client/src/Services/api.js`.
  - Base URL defaults to deployed server: `https://todo-app-server-eosin.vercel.app/api`. A localhost alternative is commented.
  - Always send `x-access-token: <token>` and, where required, `params: { userId }`.
  - Example: `getTodos(token, userId)` and `createTodo(todo, token, userId)`.
- Pages and flow: unauthenticated users are redirected from `Dashboard` to `/login`.
  - `Login.js` and `Register.js` call API helpers and then dispatch `setUser`, `setToken`, `setUserId`, `setPicture`.
  - `TodoList.js` fetches and mutates todos via the API helpers and reflects changes locally.
- Styling: `styled-components` and Bootstrap classes together; prefer extending existing patterns in components (see `TodoList`, `TodoListItem`).

## Dev workflows
- Client
  - Install: `cd client && npm install`
  - Run: `npm start` (CRA on port 3000)
  - Tests: `npm test` (React Testing Library under `client/src/__test__/`)
- Server
  - Install: `cd server && npm install`
  - Dev: `npm run dev` (nodemon on port 8080)
  - Env required: `MONGO_DB_URL`, `TOKEN_KEY` (note: some docs say `TOKEN`; code uses `TOKEN_KEY`)
  - Tests: Jest is configured and specs exist (e.g., `server/controllers/todoController.spec.js`), but the `test` script is a placeholder. To enable, add a proper script or invoke `npx jest`.
- Docker: simple Node 16 images for client and server (`client/Dockerfile`, `server/Dockerfile`).
- Deploy: Vercel for both; client uses the Vercel-hosted server URL; see `server/vercel.json`.

## Conventions and gotchas
- Auth header is non-standard name: use `x-access-token` (not `Authorization`). Server reads from body/query/header but the client standardizes on header.
- User scoping is enforced in queries, not via token claims. Always include `userId` for list and bulk-delete endpoints.
- Completion timestamps: client mutates `todo.completed_time` based on `todo.completed` before PUT. Preserve this behavior unless moving logic server-side.
- Response shapes differ between login and register (register returns `{ user, token }`; login returns user with `token` set). Callers map fields explicitly, see `Login.js`/`Register.js`.
- UI components often accept full objects (e.g., `TodoListItem` uses `message` as a todo object). Follow this shape when adding features.

## Where to look first
- Client entry: `client/src/App.js`, routes in `client/src/Pages/*`.
- State/auth: `client/src/Store/userSlice.js` and `client/src/Services/api.js`.
- Server entry and wiring: `server/index.js`, routes in `server/routes/*`, controllers in `server/controllers/*`, models in `server/models/*`, auth in `server/middleware/auth.js`.

If anything above is unclear or you need additional conventions documented (e.g., adding new filters to todo queries, expanding tests, or local/dev vs prod URLs), call it out and we’ll refine this guide.