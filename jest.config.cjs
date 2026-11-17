/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.unit.ts'],
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/1-domain/$1',
    '^@business/(.*)$': '<rootDir>/src/2-business/$1',
    '^@controller/(.*)$': '<rootDir>/src/3-controller/$1',
    '^@framework/(.*)$': '<rootDir>/src/4-framework/$1',
  },
}

module.exports = config
