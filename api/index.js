// Vercel Serverless Function Entrypoint
// Directly forwards /api/* incoming HTTP requests to Express app
const app = require('../backend/src/server');

module.exports = app;
