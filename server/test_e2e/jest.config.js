const path = require('path');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFiles: ['<rootDir>/setup-env.ts'],
  moduleNameMapper: {
    '^typeorm$': require.resolve('typeorm'),
    '^uuid$': path.resolve(__dirname, '../../node_modules/.pnpm/uuid@11.1.1/node_modules/uuid/dist/cjs/index.js'),
  },
  testTimeout: 30000,
};
