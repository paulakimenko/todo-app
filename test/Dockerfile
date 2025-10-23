# E2E tests container for Playwright
# Includes all Playwright browsers; fine even if we only use APIRequest
FROM mcr.microsoft.com/playwright:v1.47.0-jammy

WORKDIR /tests

COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent

COPY . .

# Default API base URL can be overridden at runtime
ENV API_BASE_URL=http://host.docker.internal:8080/api

CMD ["npx", "playwright", "test", "--reporter=list"]
