module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js', '**/*.spec.js'],
  // IMPORTANT: We use a real Postgres database flow for e2e tests, not SQLite.
  // Ensure that tests connect to a separate test database (e.g., using DB_TEST_DATABASE).
  // You should run a SQL script to reset the database between tests instead of relying on SQLite's in-memory recreation.
};
