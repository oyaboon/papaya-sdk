/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  bail: false,
  testMatch: [
    '**/rateEncoding.test.ts',
    '**/basic-sdk-test.ts', 
    '**/new-sdk-test.ts',
    '**/subscriptions.test.ts',
    '**/projectSettings.test.ts'
  ],
  // Set a timeout of 10 seconds for tests
  testTimeout: 10000,
};

module.exports = config; 