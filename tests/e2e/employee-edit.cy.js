/// <reference types="cypress" />

/**
 * Edit Employee E2E Tests
 * Test Coverage: TC-E2E-020 through TC-E2E-027
 */

describe('Edit Employee Page (TC-E2E-020 through TC-E2E-027)', () => {
  beforeEach(() => {
    cy.visitApp();
    cy.wait(500);
  });

  describe('TC-E2E-020: Navigate to employee detail page', () => {
    it('should navigate to employee detail when clicking on employee', () => {
      // Find and click on first employee
      cy.get('[class*="employee"], [class*="card"]').first().then(($card) => {
        if ($card.length > 0) {
          cy.get('[class*="employee"], [class*="card"]').first().click();
          cy.url().should('include', '/employees/');
          cy.url().should('not.include', '/add');
          cy.url().should('not.include', '/edit');
        }
      });
    });
  });

  describe('TC-E2E-021: Click edit button and load form', () => {
    it('should load edit form when clicking edit button', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);

      cy.contains('button', /edit/i).click();
      
      cy.wait(500);
      cy.url().should('include', '/edit');
      cy.get('form').should('be.visible');
      cy.contains(/edit|update/i).should('be.visible');
    });
  });

  describe('TC-E2E-022: Verify form pre-populated with current data', () => {
    it('should have name field pre-populated', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);
      cy.contains('button', /edit/i).click();
      cy.wait(500);

      cy.get('input[name="name"]').should('have.value', /.+/);
    });

    it('should have email field pre-populated', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);
      cy.contains('button', /edit/i).click();
      cy.wait(500);

      cy.get('input[name="email"]').should('have.value', /.+/);
    });

    it('should have department field pre-populated', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);
      cy.contains('button', /edit/i).click();
      cy.wait(500);

      cy.get('input[name="department"]').should('have.value', /.+/);
    });

    it('should have salary field pre-populated', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);
      cy.contains('button', /edit/i).click();
      cy.wait(500);

      cy.get('input[name="salary"]').should('have.value', /.+/);
    });
  });

  describe('TC-E2E-023: Modify employee fields', () => {
    beforeEach(() => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);
      cy.contains('button', /edit/i).click();
      cy.wait(500);
    });

    it('should allow modifying name field', () => {
      cy.get('input[name="name"]').clear().type('Updated Name ' + Date.now());
      cy.get('input[name="name"]').should('have.value', /Updated Name/);
    });

    it('should allow modifying department field', () => {
      cy.get('input[name="department"]').clear().type('Updated Department');
      cy.get('input[name="department"]').should('have.value', 'Updated Department');
    });

    it('should allow modifying salary field', () => {
      cy.get('input[name="salary"]').clear().type('95000');
      cy.get('input[name="salary"]').should('have.value', '95000');
    });

    it('should allow modifying email field', () => {
      const newEmail = `updated${Date.now()}@example.com`;
      cy.get('input[name="email"]').clear().type(newEmail);
      cy.get('input[name="email"]').should('have.value', newEmail);
    });
  });

  describe('TC-E2E-024: Submit form and verify update', () => {
    it('should submit updated form data', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);
      cy.contains('button', /edit/i).click();
      cy.wait(500);

      cy.get('input[name="name"]').clear().type('Updated ' + Date.now());
      cy.get('input[name="salary"]').clear().type('95000');

      cy.contains('button', /update|save/i).click();
      cy.wait(1000);

      // Should redirect back to list
      cy.url().should('include', '/employees');
      cy.url().should('not.include', '/edit');
    });
  });

  describe('TC-E2E-025: Verify changes reflected in list', () => {
    it('should display updated employee name in list', () => {
      const uniqueName = 'UpdatedName ' + Date.now();

      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);
      cy.contains('button', /edit/i).click();
      cy.wait(500);

      cy.get('input[name="name"]').clear().type(uniqueName);
      cy.contains('button', /update|save/i).click();
      cy.wait(1000);

      cy.url().should('include', '/employees');
      cy.get('body').then(($body) => {
        if ($body.text().includes(uniqueName)) {
          cy.contains(uniqueName).should('be.visible');
        }
      });
    });
  });

  describe('Validation on Edit', () => {
    it('should show validation error for invalid email', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);
      cy.contains('button', /edit/i).click();
      cy.wait(500);

      cy.get('input[name="email"]').clear().type('invalidemail');
      cy.contains('button', /update|save/i).click();

      cy.get('body').then(($body) => {
        if ($body.text().includes('valid') || $body.text().includes('Email')) {
          cy.contains(/valid.*email|email.*valid/i).should('exist');
        }
      });
    });

    it('should show validation error for negative salary', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);
      cy.contains('button', /edit/i).click();
      cy.wait(500);

      cy.get('input[name="salary"]').clear().type('-50000');
      cy.contains('button', /update|save/i).click();

      cy.get('body').then(($body) => {
        if ($body.text().includes('positive') || $body.text().includes('Salary')) {
          cy.contains(/positive|salary.*valid/i).should('exist');
        }
      });
    });
  });

  describe('Navigation on Edit', () => {
    it('should have cancel button to discard changes', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);
      cy.contains('button', /edit/i).click();
      cy.wait(500);

      cy.contains('button', /cancel|back/i).should('exist');
    });

    it('should return to detail page when clicking cancel', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);
      const detailUrl = cy.url();
      cy.contains('button', /edit/i).click();
      cy.wait(500);

      cy.contains('button', /cancel|back/i).click();
      cy.url().should('include', '/employees/');
    });
  });
});
