module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
  collectCoverageFrom: ["src/**/*.js", "!src/server.js", "!src/tests/**"],
  coverageDirectory: "coverage",
  clearMocks: true,
  verbose: true,
};