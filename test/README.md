# Playwright tests

This folder contains Playwright-based functional tests for the Todo app, covering both API and UI smoke flows.

## Structure

- `playwright.config.js` — configuration; baseURL is taken from `API_BASE_URL`
- `tests/api.crud.spec.js` — API smoke and CRUD flow
- `tests/ui.smoke.spec.js` — UI smoke tests (login redirect, login → add todo → logout)
- `Dockerfile` — optional container runner for CI/ephemeral runs

## Prerequisites

- Node.js 18+
- Running services locally: API at `http://localhost:8080/api`, client at `http://localhost:3000`
  - Easiest: `make up` from repo root (docker-compose)

## Install

```sh
npm install
npx playwright install
```

## Run

- Run all tests (defaults assume local services):
```sh
API_BASE_URL=http://localhost:8080/api CLIENT_BASE_URL=http://localhost:3000 npx playwright test --reporter=line
```
- Or via Makefile from repo root:
```sh
make functional-test
```

## Notes

- UI tests attach listeners that fail the test if:
  - There are JavaScript runtime errors on the page
  - Any requests fail
  - Any HTTP responses are 4xx/5xx (ignoring common noise like sourcemaps and favicons)
- API tests generate unique users per run and perform a full register → login → CRUD → delete-all flow.
