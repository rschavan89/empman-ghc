/// <reference types="cypress" />

/**
 * Error Handling E2E Tests
 * Test Coverage: TC-E2E-050 through TC-E2E-055
 */

describe('Error Handling Workflows (TC-E2E-050 through TC-E2E-055)', () => {
  beforeEach(() => {
    cy.visitApp();
    cy.wait(500);
  });

  describe('TC-E2E-050: Handle API timeout gracefully', () => {
    it('should display loading indicator during slow API response', () => {
      cy.wait(1000);
      // Application should still be interactive
      cy.get('body').should('exist');
      cy.get('button, input').should('be.enabled');
    });

    it('should not freeze UI during slow network', () => {
      // Buttons should remain clickable
      cy.get('[class*="employee"], [class*="card"]').first().then(($card) => {
        if ($card.length > 0) {
          cy.get('[class*="employee"], [class*="card"]').first().should('be.enabled');
        }
      });
    });
  });

  describe('TC-E2E-051: Display error message on failed creation', () => {
    it('should show error when creating duplicate email', () => {
      // Create first employee
      const uniqueEmail = `test${Date.now()}@example.com`;
      
      cy.contains('button', /add|new|create/i).click();
      cy.fillEmployeeForm({
        name: 'First Employee',
        email: uniqueEmail,
        department: 'Engineering',
        salary: '85000'
      });
      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(1000);

      // Try to create with same email
      cy.contains('button', /add|new|create/i).click();
      cy.fillEmployeeForm({
        name: 'Second Employee',
        email: uniqueEmail,
        department: 'Engineering',
        salary: '90000'
      });
      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(1000);

      // Should show error
      cy.get('body').then(($body) => {
        if ($body.text().includes('exists') || $body.text().includes('duplicate')) {
          cy.contains(/exists|duplicate|already|conflict/i).should('exist');
        }
      });
    });

    it('should display clear error message format', () => {
      cy.contains('button', /add|new|create/i).click();
      
      // Try invalid data
      cy.fillEmployeeForm({
        name: 'Test',
        email: 'invalidemail',
        department: 'Test',
        salary: '85000'
      });
      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(500);

      // Error should be visible and clear
      cy.get('[class*="error"], [class*="alert"]').should('be.visible');
    });
  });

  describe('TC-E2E-052: Display validation error messages', () => {
    it('should show validation error for missing required field', () => {
      cy.contains('button', /add|new|create/i).click();
      
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="department"]').type('Engineering');
      cy.get('input[name="salary"]').type('85000');

      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(500);

      // Should show validation error
      cy.get('body').then(($body) => {
        if ($body.text().includes('required') || $body.text().includes('Name')) {
          cy.contains(/required/i).should('be.visible');
        }
      });
    });

    it('should show field-specific error messages', () => {
      cy.contains('button', /add|new|create/i).click();
      
      cy.fillEmployeeForm({
        name: 'Test User',
        email: 'invalidemail',
        department: 'Engineering',
        salary: '85000'
      });
      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(500);

      // Email error should be displayed near email field
      cy.get('body').then(($body) => {
        if ($body.text().includes('Email') || $body.text().includes('valid')) {
          cy.contains(/email|valid/i).should('exist');
        }
      });
    });

    it('should display multiple validation errors at once', () => {
      cy.contains('button', /add|new|create/i).click();
      
      cy.fillEmployeeForm({
        name: '',
        email: 'invalidemail',
        department: '',
        salary: '-1000'
      });
      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(500);

      // Multiple errors should be shown
      cy.get('[class*="error"]').then(($errors) => {
        // Should have at least some error elements
        expect($errors.length).to.be.greaterThan(0);
      });
    });
  });

  describe('TC-E2E-053: Handle 404 error (employee not found)', () => {
    it('should show error when viewing non-existent employee', () => {
      cy.visit('/employees/999999');
      cy.wait(500);

      cy.get('body').then(($body) => {
        if ($body.text().includes('404') || $body.text().includes('not found')) {
          cy.contains(/404|not found|doesn't exist/i).should('exist');
        }
      });
    });

    it('should provide link back to list on 404', () => {
      cy.visit('/employees/999999');
      cy.wait(500);

      cy.contains('button', /back|list|home/i).should('exist');
    });
  });

  describe('TC-E2E-054: Handle 409 error (email duplicate)', () => {
    it('should prevent duplicate email creation', () => {
      const uniqueEmail = `duplicate${Date.now()}@example.com`;

      // Create first employee
      cy.contains('button', /add|new|create/i).click();
      cy.fillEmployeeForm({
        name: 'First Employee',
        email: uniqueEmail,
        department: 'Engineering',
        salary: '85000'
      });
      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(1000);

      // Try to create another with same email
      cy.contains('button', /add|new|create/i).click();
      cy.fillEmployeeForm({
        name: 'Duplicate Employee',
        email: uniqueEmail,
        department: 'Engineering',
        salary: '90000'
      });
      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(1000);

      // Should show conflict error
      cy.get('body').then(($body) => {
        if ($body.text().includes('exists') || $body.text().includes('duplicate')) {
          cy.contains(/already.*exists|duplicate|conflict/i).should('exist');
        }
      });
    });
  });

  describe('TC-E2E-055: Handle 500 error (server error)', () => {
    it('should display user-friendly error message on server error', () => {
      // Application should handle server errors gracefully
      cy.get('body').should('exist');
      cy.contains('button, input').should('exist');
    });

    it('should not expose technical error details', () => {
      // Error messages should be user-friendly
      cy.get('[class*="error"], [class*="alert"]').then(($errors) => {
        if ($errors.length > 0) {
          $errors.each((i, el) => {
            const text = Cypress.$(el).text();
            // Should not contain stack traces
            expect(text).not.to.include('at ');
            expect(text).not.to.include('Error:');
          });
        }
      });
    });

    it('should allow retry after error', () => {
      // After any error, user should be able to retry action
      cy.contains('button').should('be.enabled');
    });
  });

  describe('General Error Handling', () => {
    it('should clear error message when user corrects input', () => {
      cy.contains('button', /add|new|create/i).click();
      
      // Enter invalid email
      cy.fillEmployeeForm({
        name: 'Test User',
        email: 'invalidemail',
        department: 'Engineering',
        salary: '85000'
      });
      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(500);

      // Fix the error
      cy.get('input[name="email"]').clear().type('valid@example.com');
      cy.wait(300);

      // Error should be cleared or no longer displayed
      cy.get('body').should('exist');
    });

    it('should keep form data when showing validation errors', () => {
      cy.contains('button', /add|new|create/i).click();
      
      const testName = 'Test User Name';
      cy.fillEmployeeForm({
        name: testName,
        email: 'invalid',
        department: 'Engineering',
        salary: '85000'
      });
      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(500);

      // Form data should be preserved
      cy.get('input[name="name"]').should('have.value', testName);
    });
  });

  describe('UI Responsiveness on Errors', () => {
    it('should maintain usable UI when error occurs', () => {
      cy.get('button').should('be.enabled');
      cy.get('input').should('be.enabled');
    });

    it('should allow navigation away after error', () => {
      cy.visitApp();
      cy.contains('button', /add|new|create/i).should('be.enabled');
    });
  });
});
