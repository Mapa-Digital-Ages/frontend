/** @type {import('jest').Config} */
module.exports = {
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['<rootDir>/src/tests/setup/polyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup/jest.ts'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  testMatch: ['<rootDir>/src/tests/**/*.test.tsx'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
        useESM: true,
      },
    ],
  },
}
