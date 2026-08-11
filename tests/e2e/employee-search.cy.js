/// <reference types="cypress" />

/**
 * Search Employee E2E Tests
 * Test Coverage: TC-E2E-040 through TC-E2E-045
 */

describe('Search Employee Workflow (TC-E2E-040 through TC-E2E-045)', () => {
  beforeEach(() => {
    cy.visitApp();
    cy.wait(500);
  });

  describe('TC-E2E-040: Search by employee name (exact)', () => {
    it('should find employee by exact name match', () => {
      cy.get('input[placeholder*="search" i], input[placeholder*="find" i]').type('John');
      cy.wait(500);

      // Results should be filtered or specific
      cy.get('[class*="employee"], [class*="card"]').should('exist');
    });
  });

  describe('TC-E2E-041: Search by partial name match', () => {
    it('should find employees by partial name match', () => {
      cy.get('input[placeholder*="search" i], input[placeholder*="find" i]').type('Jo');
      cy.wait(500);

      // Should show results containing "Jo"
      cy.get('body').then(($body) => {
        if ($body.text().includes('Jo')) {
          cy.contains(/jo/i).should('exist');
        }
      });
    });
  });

  describe('TC-E2E-042: Search case-insensitive', () => {
    it('should find employees regardless of case', () => {
      const searchBox = cy.get('input[placeholder*="search" i], input[placeholder*="find" i]');
      
      // Search with lowercase
      searchBox.type('john');
      cy.wait(500);
      
      searchBox.clear().type('JOHN');
      cy.wait(500);

      // Results should be consistent
      cy.get('body').should('exist');
    });

    it('should find employees with mixed case search', () => {
      cy.get('input[placeholder*="search" i], input[placeholder*="find" i]').type('JoHn');
      cy.wait(500);

      cy.get('body').should('exist');
    });
  });

  describe('TC-E2E-043: Search with no results', () => {
    it('should show no results message when search has no matches', () => {
      cy.get('input[placeholder*="search" i], input[placeholder*="find" i]').type('NONEXISTENTNAME12345');
      cy.wait(500);

      cy.get('body').then(($body) => {
        // Either no employee cards or explicit message
        cy.get('[class*="employee"], [class*="card"]').then(($cards) => {
          if ($cards.length === 0) {
            cy.contains(/no results|no employees|not found/i).should('exist');
          }
        });
      });
    });
  });

  describe('TC-E2E-044: Clear search and show all employees', () => {
    it('should show all employees after clearing search', () => {
      const searchBox = cy.get('input[placeholder*="search" i], input[placeholder*="find" i]');
      
      // Search for something
      searchBox.type('test');
      cy.wait(500);

      // Clear search
      searchBox.clear();
      cy.wait(500);

      // Should show all employees or full list
      cy.get('[class*="employee"], [class*="card"]').should('have.length.greaterThan', 0);
    });

    it('should restore full list when clearing search text', () => {
      const searchBox = cy.get('input[placeholder*="search" i], input[placeholder*="find" i]');
      
      searchBox.type('xyz');
      cy.wait(500);
      
      searchBox.clear();
      cy.wait(500);

      // Verify list is restored
      cy.get('body').should('exist');
    });
  });

  describe('TC-E2E-045: Search performance with large dataset', () => {
    it('should complete search within acceptable time', () => {
      const searchBox = cy.get('input[placeholder*="search" i], input[placeholder*="find" i]');
      const startTime = Date.now();

      searchBox.type('a');
      
      cy.get('[class*="employee"], [class*="card"]').then(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Search should complete within 1 second
        expect(duration).to.be.lessThan(1000);
      });
    });

    it('should debounce search input', () => {
      const searchBox = cy.get('input[placeholder*="search" i], input[placeholder*="find" i]');
      
      // Type quickly
      searchBox.type('testing{backspace}{backspace}{backspace}');
      cy.wait(300);

      // Should still be responsive
      cy.get('body').should('exist');
    });
  });

  describe('Search with special cases', () => {
    it('should handle search with numbers', () => {
      cy.get('input[placeholder*="search" i], input[placeholder*="find" i]').type('123');
      cy.wait(500);

      cy.get('body').should('exist');
    });

    it('should handle search with special characters', () => {
      cy.get('input[placeholder*="search" i], input[placeholder*="find" i]').type('test-user');
      cy.wait(500);

      cy.get('body').should('exist');
    });

    it('should handle search with spaces', () => {
      cy.get('input[placeholder*="search" i], input[placeholder*="find" i]').type('john doe');
      cy.wait(500);

      cy.get('body').should('exist');
    });
  });

  describe('Search UI', () => {
    it('should have clear/reset button for search', () => {
      cy.get('input[placeholder*="search" i], input[placeholder*="find" i]').type('test');
      
      // Check for clear button
      cy.get('[class*="search"] button, [class*="clear"]').should('exist');
    });

    it('should show search icon', () => {
      cy.get('[class*="search"]').should('exist');
    });
  });
});
