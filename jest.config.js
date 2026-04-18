/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    "^controllers/(.*)$": "<rootDir>/controllers/$1",
    "^services/(.*)$": "<rootDir>/services/$1",
    "^repositories/(.*)$": "<rootDir>/repositories/$1",
    "^utils/(.*)$": "<rootDir>/utils/$1",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testMatch: ["**/tests/**/*.test.ts"],
};
