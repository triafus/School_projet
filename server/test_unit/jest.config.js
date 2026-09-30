module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  }
};
