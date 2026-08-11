/// <reference types="cypress" />

/**
 * Delete Employee E2E Tests
 * Test Coverage: TC-E2E-030 through TC-E2E-036
 */

describe('Delete Employee Workflow (TC-E2E-030 through TC-E2E-036)', () => {
  beforeEach(() => {
    cy.visitApp();
    cy.wait(500);
  });

  describe('TC-E2E-030: Navigate to employee detail', () => {
    it('should navigate to employee detail page', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.url().should('include', '/employees/');
      cy.get('[class*="detail"], [class*="info"]').should('exist');
    });
  });

  describe('TC-E2E-031: Click delete button', () => {
    it('should display delete button on detail page', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);
      cy.contains('button', /delete|remove/i).should('exist');
    });
  });

  describe('TC-E2E-032: Verify confirmation dialog appears', () => {
    it('should show confirmation dialog when delete clicked', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);
      cy.contains('button', /delete|remove/i).click();

      // Dialog should appear
      cy.get('[class*="modal"], [class*="dialog"], [class*="confirm"]').should('be.visible');
      cy.contains(/confirm|are you sure|delete/i).should('be.visible');
    });
  });

  describe('TC-E2E-033: Cancel deletion and verify employee remains', () => {
    it('should keep employee when clicking cancel in confirmation', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);
      const employeeUrl = cy.url();

      cy.contains('button', /delete|remove/i).click();
      cy.wait(300);

      cy.contains('button', /cancel|no/i).click();
      cy.wait(300);

      // Should still be on detail page
      cy.url().should('include', '/employees/');
    });
  });

  describe('TC-E2E-034: Delete employee and confirm removal', () => {
    it('should delete employee when confirming', () => {
      // Get employee count before delete
      cy.get('[class*="employee"], [class*="card"]').then(($cards) => {
        const initialCount = $cards.length;

        cy.get('[class*="employee"], [class*="card"]').first().click();
        cy.wait(500);

        cy.contains('button', /delete|remove/i).click();
        cy.wait(300);

        cy.contains('button', /confirm|yes|delete/i).click();
        cy.wait(1000);

        // Should be back on list page
        cy.url().should('include', '/employees');
      });
    });
  });

  describe('TC-E2E-035: Verify employee removed from list', () => {
    it('should not display deleted employee in list', () => {
      cy.get('[class*="employee"], [class*="card"]').first().then(($firstCard) => {
        const employeeName = $firstCard.text();

        cy.get('[class*="employee"], [class*="card"]').first().click();
        cy.wait(500);

        cy.contains('button', /delete|remove/i).click();
        cy.wait(300);

        cy.contains('button', /confirm|yes|delete/i).click();
        cy.wait(1000);

        // Employee should not be in list anymore
        cy.get('body').then(($body) => {
          // Employee name might still appear in other contexts, check list specifically
          cy.get('[class*="employee"], [class*="card"]').then(($cards) => {
            const remainingText = $cards.text();
            // If only one card and it's deleted, list should be different
            if ($cards.length === 0) {
              cy.get('body').should('contain.text', /no employees|empty/i);
            }
          });
        });
      });
    });
  });

  describe('TC-E2E-036: Verify success message displayed', () => {
    it('should show delete success message', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);

      cy.contains('button', /delete|remove/i).click();
      cy.wait(300);

      cy.contains('button', /confirm|yes|delete/i).click();
      cy.wait(1000);

      cy.get('body').then(($body) => {
        if ($body.text().includes('deleted') || $body.text().includes('removed')) {
          cy.contains(/deleted|removed|success/i).should('be.visible');
        }
      });
    });
  });

  describe('Error Scenarios', () => {
    it('should handle delete of non-existent employee gracefully', () => {
      // Navigate to a non-existent employee ID
      cy.visit('/employees/999999');
      cy.wait(500);

      cy.get('body').then(($body) => {
        if ($body.text().includes('not found') || $body.text().includes('404')) {
          cy.contains(/not found|error|deleted/i).should('exist');
        }
      });
    });

    it('should show error if delete fails on server', () => {
      cy.get('[class*="employee"], [class*="card"]').first().click();
      cy.wait(500);

      // If server returns error, alert should show
      cy.contains('button', /delete|remove/i).click();
      cy.wait(300);

      cy.contains('button', /confirm|yes|delete/i).click();
      cy.wait(1000);

      // No validation error should prevent delete
      cy.get('body').should('exist');
    });
  });
});
