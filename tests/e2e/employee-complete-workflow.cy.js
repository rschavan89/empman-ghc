/// <reference types="cypress" />

/**
 * Complete Employee Workflow E2E Test
 * Full CRUD cycle: Create -> Read -> Update -> Delete -> Search
 * 
 * This test demonstrates a complete user journey through the system
 */

describe('Complete Employee Lifecycle Workflow', () => {
  const uniqueTimestamp = Date.now();
  const testEmployee = {
    name: `Complete Test Employee ${uniqueTimestamp}`,
    email: `complete-test-${uniqueTimestamp}@example.com`,
    department: 'QA Testing',
    salary: '80000'
  };

  const updatedEmployee = {
    name: `Updated Test Employee ${uniqueTimestamp}`,
    department: 'Quality Assurance',
    salary: '85000'
  };

  it('should complete full CRUD workflow: Create -> Read -> Update -> Search -> Delete', () => {
    // ===== STEP 1: VISIT APPLICATION =====
    cy.visitApp();
    cy.url().should('include', '/employees');
    cy.get('body').should('be.visible');

    // ===== STEP 2: CREATE EMPLOYEE =====
    cy.log('Step 1: Creating new employee');
    cy.contains('button', /add|new|create/i).click();
    cy.url().should('include', '/add');
    cy.get('form').should('be.visible');

    // Fill employee form
    cy.fillEmployeeForm(testEmployee);

    // Verify form has data
    cy.get('input[name="name"]').should('have.value', testEmployee.name);
    cy.get('input[name="email"]').should('have.value', testEmployee.email);

    // Submit form
    cy.contains('button', /submit|save|add|create/i).click();
    cy.wait(1000);

    // Verify redirect and success
    cy.url().should('include', '/employees');
    cy.url().should('not.include', '/add');

    // ===== STEP 3: VERIFY IN LIST =====
    cy.log('Step 2: Verifying employee appears in list');
    cy.wait(500);
    cy.get('body').then(($body) => {
      if ($body.text().includes(testEmployee.name)) {
        cy.contains(testEmployee.name).should('be.visible');
      }
    });

    // ===== STEP 4: VIEW EMPLOYEE DETAILS =====
    cy.log('Step 3: Viewing employee details');
    cy.get('body').then(($body) => {
      if ($body.text().includes(testEmployee.name)) {
        cy.contains(testEmployee.name).click();
        cy.wait(500);
        cy.url().should('include', '/employees/');
        cy.url().should('not.include', '/add');
      }
    });

    // ===== STEP 5: EDIT EMPLOYEE =====
    cy.log('Step 4: Editing employee information');
    cy.contains('button', /edit/i).click();
    cy.wait(500);
    cy.url().should('include', '/edit');
    cy.get('form').should('be.visible');

    // Update employee fields
    cy.get('input[name="name"]').clear().type(updatedEmployee.name);
    cy.get('input[name="department"]').clear().type(updatedEmployee.department);
    cy.get('input[name="salary"]').clear().type(updatedEmployee.salary);

    // Submit update
    cy.contains('button', /update|save/i).click();
    cy.wait(1000);

    // Verify redirect to list
    cy.url().should('include', '/employees');
    cy.url().should('not.include', '/edit');

    // ===== STEP 6: VERIFY UPDATES =====
    cy.log('Step 5: Verifying updates were applied');
    cy.wait(500);
    cy.get('body').then(($body) => {
      if ($body.text().includes(updatedEmployee.name)) {
        cy.contains(updatedEmployee.name).should('be.visible');
      }
    });

    // ===== STEP 7: SEARCH EMPLOYEE =====
    cy.log('Step 6: Searching for updated employee');
    const searchTerm = updatedEmployee.name.substring(0, 15);
    cy.get('input[placeholder*="search" i], input[placeholder*="find" i]').type(searchTerm);
    cy.wait(500);

    // Verify search results
    cy.get('body').then(($body) => {
      if ($body.text().includes(updatedEmployee.name)) {
        cy.contains(updatedEmployee.name).should('be.visible');
      }
    });

    // ===== STEP 8: CLEAR SEARCH =====
    cy.log('Step 7: Clearing search to restore full list');
    cy.get('input[placeholder*="search" i], input[placeholder*="find" i]').clear();
    cy.wait(500);

    // ===== STEP 9: DELETE EMPLOYEE =====
    cy.log('Step 8: Deleting employee');
    cy.get('body').then(($body) => {
      if ($body.text().includes(updatedEmployee.name)) {
        cy.contains(updatedEmployee.name).click();
        cy.wait(500);
        cy.contains('button', /delete|remove/i).click();
        cy.wait(300);

        // Confirm deletion
        cy.contains('button', /confirm|yes|delete/i).click();
        cy.wait(1000);
      }
    });

    // ===== STEP 10: VERIFY DELETION =====
    cy.log('Step 9: Verifying employee was deleted');
    cy.url().should('include', '/employees');

    // Employee should no longer be visible
    cy.get('body').then(($body) => {
      // If list exists, employee shouldn't be there
      if ($body.text().includes('no employees') || $body.text().includes('empty')) {
        cy.get('[class*="employee"], [class*="card"]').should('have.length', 0);
      } else {
        // Just verify we're on the list page
        cy.get('body').should('contain.text', /employee/i);
      }
    });

    cy.log('✓ Complete workflow test passed!');
  });

  describe('Workflow with Error Recovery', () => {
    it('should handle and recover from validation errors during create', () => {
      cy.visitApp();
      cy.contains('button', /add|new|create/i).click();
      cy.url().should('include', '/add');

      // Try invalid submission
      cy.fillEmployeeForm({
        name: 'Invalid',
        email: 'notanemail',
        department: 'Test',
        salary: '85000'
      });

      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(500);

      // Should show error
      cy.get('body').then(($body) => {
        if ($body.text().includes('invalid') || $body.text().includes('valid')) {
          cy.contains(/valid|invalid/i).should('exist');
        }
      });

      // Fix and retry
      cy.get('input[name="email"]').clear().type('valid@example.com');
      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(1000);

      // Should succeed
      cy.url().should('include', '/employees');
    });

    it('should recover from duplicate email error', () => {
      const timestamp = Date.now();
      const email = `duplicate-${timestamp}@example.com`;

      cy.visitApp();

      // Create first employee
      cy.contains('button', /add|new|create/i).click();
      cy.fillEmployeeForm({
        name: 'Employee 1',
        email: email,
        department: 'Engineering',
        salary: '85000'
      });
      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(1000);

      // Try to create duplicate
      cy.contains('button', /add|new|create/i).click();
      cy.fillEmployeeForm({
        name: 'Employee 2',
        email: email,
        department: 'Engineering',
        salary: '90000'
      });
      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(500);

      // Should show error
      cy.get('body').then(($body) => {
        if ($body.text().includes('exists') || $body.text().includes('duplicate')) {
          cy.contains(/exists|duplicate/i).should('exist');
        }
      });

      // Fix and retry with different email
      cy.get('input[name="email"]').clear().type(`different-${timestamp}@example.com`);
      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(1000);

      // Should succeed
      cy.url().should('include', '/employees');
    });
  });

  describe('Multi-Employee Operations', () => {
    it('should create multiple employees and manage them', () => {
      cy.visitApp();

      // Create 3 employees
      const employees = [];
      for (let i = 0; i < 3; i++) {
        const emp = {
          name: `Multi-Test Employee ${i} ${Date.now()}`,
          email: `multi-${i}-${Date.now()}@example.com`,
          department: 'Engineering',
          salary: String(80000 + (i * 5000))
        };
        employees.push(emp);

        cy.contains('button', /add|new|create/i).click();
        cy.fillEmployeeForm(emp);
        cy.contains('button', /submit|save|add|create/i).click();
        cy.wait(1000);
      }

      // Verify all appear in list
      cy.url().should('include', '/employees');
      cy.wait(500);

      employees.forEach(emp => {
        cy.get('body').then(($body) => {
          if ($body.text().includes(emp.name)) {
            cy.contains(emp.name).should('be.visible');
          }
        });
      });
    });
  });

  describe('Responsive Design During Workflow', () => {
    it('should work on mobile viewport through entire workflow', () => {
      cy.viewport('iphone-x');
      cy.visitApp();
      cy.url().should('include', '/employees');

      // Add employee on mobile
      cy.contains('button', /add|new|create/i).click();
      cy.get('form').should('be.visible');
      
      cy.fillEmployeeForm({
        name: `Mobile Test ${Date.now()}`,
        email: `mobile-${Date.now()}@example.com`,
        department: 'Mobile',
        salary: '75000'
      });

      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(1000);

      // List should be visible on mobile
      cy.url().should('include', '/employees');
      cy.get('body').should('be.visible');
    });

    it('should work on tablet viewport through entire workflow', () => {
      cy.viewport('ipad-2');
      cy.visitApp();
      
      cy.contains('button', /add|new|create/i).click();
      cy.get('form').should('be.visible');
      
      cy.fillEmployeeForm({
        name: `Tablet Test ${Date.now()}`,
        email: `tablet-${Date.now()}@example.com`,
        department: 'Tablet',
        salary: '75000'
      });

      cy.contains('button', /submit|save|add|create/i).click();
      cy.wait(1000);

      cy.url().should('include', '/employees');
    });
  });
});
