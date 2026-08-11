const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'tests/e2e/**/*.cy.js',
    supportFile: 'tests/support/e2e.js',
    screenshotOnRunFailure: true,
    video: true,
    videoUploadOnPasses: false,
    requestTimeout: 10000,
    responseTimeout: 10000,
    defaultCommandTimeout: 5000,
    pageLoadTimeout: 30000,
    taskTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720,
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
  },
});
