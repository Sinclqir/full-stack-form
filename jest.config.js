module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
    moduleFileExtensions: ["js", "jsx"],
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["lcov", "text"],
  };
  