// Import commands
import './commands';

// Disable uncaught exception handling in tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // Only return false for expected errors
  if (err.message.includes('expected')) {
    return false;
  }
  // Let other errors fail the test
  return true;
});

// Global test timeout
Cypress.config('defaultCommandTimeout', 5000);

// Log all API requests
before(() => {
  cy.log('Test suite started');
});

after(() => {
  cy.log('Test suite completed');
});
