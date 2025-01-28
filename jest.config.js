// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json", // Pointing to the test-specific tsconfig
    },
  },
  testMatch: ["**/tests/**/*.test.ts"], // Match all .test.ts files in the tests folder
};
