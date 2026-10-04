module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  testEnvironment: 'node',
  testRegex: 'test_integration/.*\\.int-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  moduleNameMapper: {
    '^typeorm$': '<rootDir>/node_modules/typeorm/index.js',
    '^uuid$': require.resolve('uuid')
  },
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  setupFiles: ['<rootDir>/test_integration/setup-env.ts']
};
