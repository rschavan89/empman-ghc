// Custom Cypress commands for Employee Management System

/**
 * Command: cy.loginUser()
 * Description: (Placeholder for future authentication)
 * Usage: cy.loginUser();
 */
Cypress.Commands.add('loginUser', () => {
  // Placeholder for future auth implementation
  cy.log('User login command (future implementation)');
});

/**
 * Command: cy.visitApp()
 * Description: Visit the application and wait for it to load
 * Usage: cy.visitApp();
 */
Cypress.Commands.add('visitApp', () => {
  cy.visit('/');
  cy.get('body').should('be.visible');
});

/**
 * Command: cy.getByTestId()
 * Description: Get element by data-testid attribute
 * Usage: cy.getByTestId('employee-list');
 */
Cypress.Commands.add('getByTestId', (selector) => {
  return cy.get(`[data-testid="${selector}"]`);
});

/**
 * Command: cy.fillEmployeeForm()
 * Description: Fill out the employee form with provided data
 * Usage: cy.fillEmployeeForm({ name: 'John Doe', email: 'john@example.com', ... });
 */
Cypress.Commands.add('fillEmployeeForm', (employeeData) => {
  if (employeeData.name) {
    cy.get('input[name="name"]').clear().type(employeeData.name);
  }
  if (employeeData.email) {
    cy.get('input[name="email"]').clear().type(employeeData.email);
  }
  if (employeeData.department) {
    cy.get('input[name="department"]').clear().type(employeeData.department);
  }
  if (employeeData.salary) {
    cy.get('input[name="salary"]').clear().type(employeeData.salary);
  }
});

/**
 * Command: cy.submitForm()
 * Description: Submit the currently visible form
 * Usage: cy.submitForm();
 */
Cypress.Commands.add('submitForm', () => {
  cy.contains('button', /submit|save|update|add/i).click();
});

/**
 * Command: cy.verifyNotification()
 * Description: Verify that a notification/alert appears with expected message
 * Usage: cy.verifyNotification('success', 'Employee created successfully');
 */
Cypress.Commands.add('verifyNotification', (type, message) => {
  cy.get(`[class*="${type}"]`).should('contain', message);
});

/**
 * Command: cy.createEmployee()
 * Description: Navigate to add employee page and create an employee (E2E operation)
 * Usage: cy.createEmployee({ name: 'John', email: 'john@example.com', ... });
 */
Cypress.Commands.add('createEmployee', (employeeData) => {
  cy.contains('button', /add employee|add new/i).click();
  cy.get('form').should('be.visible');
  cy.fillEmployeeForm(employeeData);
  cy.submitForm();
  cy.contains('created|added', { matchCase: false }).should('be.visible');
});

/**
 * Command: cy.deleteEmployee()
 * Description: Delete an employee by clicking delete button and confirming
 * Usage: cy.deleteEmployee();
 */
Cypress.Commands.add('deleteEmployee', () => {
  cy.contains('button', /delete/i).click();
  cy.contains('button', /confirm|yes|delete/i).click();
  cy.contains('deleted|removed', { matchCase: false }).should('be.visible');
});

/**
 * Command: cy.searchEmployee()
 * Description: Search for employee by name
 * Usage: cy.searchEmployee('John Doe');
 */
Cypress.Commands.add('searchEmployee', (searchTerm) => {
  cy.get('input[placeholder*="search" i]').clear().type(searchTerm);
  cy.wait(500); // Wait for debounce
});

/**
 * Command: cy.verifyEmployeeInList()
 * Description: Verify employee appears in the list
 * Usage: cy.verifyEmployeeInList({ name: 'John Doe', email: 'john@example.com' });
 */
Cypress.Commands.add('verifyEmployeeInList', (employeeData) => {
  cy.contains(employeeData.name).should('be.visible');
  if (employeeData.email) {
    cy.contains(employeeData.email).should('be.visible');
  }
});

/**
 * Command: cy.navigateToEmployee()
 * Description: Click on an employee in the list to view details
 * Usage: cy.navigateToEmployee('John Doe');
 */
Cypress.Commands.add('navigateToEmployee', (employeeName) => {
  cy.contains(employeeName).click();
  cy.url().should('include', '/employees/');
});

/**
 * Command: cy.navigateToEditEmployee()
 * Description: Navigate to edit page for an employee
 * Usage: cy.navigateToEditEmployee();
 */
Cypress.Commands.add('navigateToEditEmployee', () => {
  cy.contains('button', /edit/i).click();
  cy.get('form').should('be.visible');
  cy.contains(/update|edit/i).should('be.visible');
});

/**
 * Command: cy.verifyErrorMessage()
 * Description: Verify an error message appears
 * Usage: cy.verifyErrorMessage('Email already exists');
 */
Cypress.Commands.add('verifyErrorMessage', (errorMessage) => {
  cy.get('[class*="error" i], [class*="alert" i]').should('contain', errorMessage);
});

/**
 * Command: cy.clearDatabase()
 * Description: Clear database via API call (for test setup/teardown)
 * Usage: cy.clearDatabase();
 */
Cypress.Commands.add('clearDatabase', () => {
  // This will be implemented when API cleanup endpoint is available
  cy.log('Database clear command (requires API endpoint)');
});
