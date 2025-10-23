# Todo List App
This is a Todo List application built with a MERN stack (MongoDB, Express.js, React, Node.js).
The app allows users to create, manage, and organize their todo tasks.

## Tech Stack
M - MongoDB </br>
E - Express </br>
R - React js </br>
N - Node js </br>

## Features
<ul>
  <li>User registration and login</li>
  <li>Create, update, and delete todo tasks</li>
  <li>Mark tasks as completed</li>
  <li>Responsive design for mobile and desktop devices</li>
</ul>

## Technologies Used
<ul>
  <li><strong>Frontend:</strong> React, Redux, React Router, Axios</li>
  <li><strong>Backend:</strong> Node.js, Express.js, MongoDB, Mongoose</li>
  <li><strong>Authentication:</strong> JSON Web Tokens (JWT), bcrypt</li>
  <li><strong>Deployment:</strong> Vercel</li>
</ul>

## Prerequisites
Node.js &
MongoDB Atlas account (for database)

## Installation and Setup
<ol>
  <li>Clone the repository: </br>
  ```
  git clone https://github.com/your-username/todo-app.git
  ```
</li>
# Todo App (MERN)

[![CI](https://github.com/paulakimenko/todo-app/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/paulakimenko/todo-app/actions/workflows/ci.yml)

Full-stack Todo application with React client, Express/Mongo API, and JWT auth. Includes unit tests and Playwright API/UI smoke tests. Docker Compose for local dev and a Makefile/scripts for common tasks.

## Stack

- MongoDB, Express, React, Node (MERN)
- Redux Toolkit, React Router, styled-components, Bootstrap
- Mongoose, JWT, bcrypt
- Jest (client/server), Playwright (API + UI)

## Quick start (Docker)

Requires Docker and Docker Compose.

- Start services
  - `make up`
- Open client in browser
  - http://localhost:3000
- API base URL
  - http://localhost:8080/api
- Stop services
  - `make down`

## Dev without Docker

Client
- `cd client && npm install && npm start`
- Configure API base URL via `REACT_APP_API_BASE_URL` (defaults to deployed API).

Server
- `cd server && npm install && npm run dev`
- Env required:
  - `MONGO_DB_URL` (e.g., mongodb://localhost:27017/todo-app)
  - `TOKEN_KEY` (JWT secret)

## Auth and multi-tenancy

- Auth header: `x-access-token: <token>` (non-standard header name)
- User scoping via `userId` query parameter on list and bulk-delete endpoints

## API overview

- POST `/api/users/register`
- POST `/api/users/login`
- GET `/api/todos?userId=...` (auth required)
- POST `/api/todos?userId=...` (auth required)
- PUT `/api/todos/:id` (auth required)
- DELETE `/api/todos/:id` (auth required)
- DELETE `/api/todos/delete/all?userId=...` (auth required)

## Tests

- Unit (client + server): `make unit-test`
- Functional (Playwright API + UI): `make functional-test`
  - Env overrides:
    - `API_BASE_URL` (default http://localhost:8080/api)
    - `CLIENT_BASE_URL` (default http://localhost:3000)

## Makefile targets

- `make up` — docker-compose up (detached)
- `make down` — docker-compose down
- `make build` — docker-compose build
- `make logs` — follow docker logs (all)
- `make unit-test` — runs client and server unit tests
- `make functional-test` — Playwright tests in `test/`

Underlying scripts are in `scripts/`.

## CI

GitHub Actions workflow `.github/workflows/ci.yml` runs unit tests and Playwright functional tests on push/PR to `main`.

## Notes

- Client defaults to deployed API unless `REACT_APP_API_BASE_URL` is set.
- Playwright suite includes UI smoke tests that fail on console JS errors, failed requests, or HTTP error responses during the scenario.
