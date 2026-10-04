module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '..',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  // Permet à Jest de transformer uuid et autres modules ESM si nécessaire
  transformIgnorePatterns: ['/node_modules/(?!(@nestjs|uuid)/)'],
  moduleNameMapper: {
    '^typeorm$': require.resolve('typeorm'),
  },
};
