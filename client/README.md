# Todo App - Client

This is the client-side code for the Todo App. It is a React application that allows users to manage their todo list. The client communicates with the server-side API to perform CRUD operations on todos.

## Features

# Todo App - Client

React app for the Todo project. Uses Redux Toolkit for auth state, React Router for navigation, and styled-components/Bootstrap for styling. API access is centralized in `src/Services/api.js`.

## Run

- Install and start:
    - `npm install`
    - `npm start` (CRA dev server on http://localhost:3000)

## Configuration

- `REACT_APP_API_BASE_URL` — API base URL used by Axios helpers
    - Default: `https://todo-app-server-eosin.vercel.app/api`
    - Local example: `http://localhost:8080/api`

## Auth

- Login and Register call the server API. On success, Redux stores `user`, `token`, `userId`, and `picture`.
- Protected route: `Dashboard` redirects unauthenticated users to `/login`.
- All `/api/todos` calls send `x-access-token` and include `userId` (for list and bulk-delete).

## Tests

- Unit tests (React Testing Library): `npm test`
- In CI/local via Make: `make unit-test` (runs server tests too)

## Structure

- `src/Pages` — `Login`, `Register`, `Dashboard`
- `src/components/Todo` — `TodoList`, `TodoListItem`, `TodoForm`
- `src/components/User` — `Avatar`
- `src/Services/api.js` — Axios helpers with auth/header handling
- `src/Store` — Redux slice (`userSlice.js`) and store
