// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 60000,
  use: {
    baseURL: process.env.API_BASE_URL || 'http://localhost:8080/api',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  reporter: [['list']],
});
