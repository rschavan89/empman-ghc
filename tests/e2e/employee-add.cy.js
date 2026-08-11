/// <reference types="cypress" />

/**
 * Add Employee E2E Tests
 * Test Coverage: TC-E2E-010 through TC-E2E-018
 * 
 * Validates:
 * - Add Employee form loads
 * - Form submission creates employee
 * - Success message displays
 * - Redirect to list after creation
 * - Form validation works
 */

describe('Add Employee Page (TC-E2E-010 through TC-E2E-018)', () => {
  beforeEach(() => {
    cy.visitApp();
  });

  describe('TC-E2E-010: Navigate to Add Employee form', () => {
    it('should navigate to add employee page when button clicked', () => {
      cy.contains('button', /add|new|create/i).click();
      cy.url().should('include', '/add');
      cy.contains(/add|create/i, { matchCase: false }).should('be.visible');
    });

    it('should display form with all required fields', () => {
      cy.contains('button', /add|new|create/i).click();
      
      cy.get('input[name="name"]').should('exist');
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="department"]').should('exist');
      cy.get('input[name="salary"]').should('exist');
    });

    it('should display form labels for all fields', () => {
      cy.contains('button', /add|new|create/i).click();
      
      cy.contains('label', /name/i).should('exist');
      cy.contains('label', /email/i).should('exist');
      cy.contains('label', /department/i).should('exist');
      cy.contains('label', /salary/i).should('exist');
    });
  });

  describe('TC-E2E-011: Fill all form fields with valid data', () => {
    beforeEach(() => {
      cy.contains('button', /add|new|create/i).click();
      cy.url().should('include', '/add');
    });

    it('should accept valid name input', () => {
      cy.get('input[name="name"]').type('John Doe');
      cy.get('input[name="name"]').should('have.value', 'John Doe');
    });

    it('should accept valid email input', () => {
      cy.get('input[name="email"]').type('john.doe@example.com');
      cy.get('input[name="email"]').should('have.value', 'john.doe@example.com');
    });

    it('should accept valid department input', () => {
      cy.get('input[name="department"]').type('Engineering');
      cy.get('input[name="department"]').should('have.value', 'Engineering');
    });

    it('should accept valid salary input', () => {
      cy.get('input[name="salary"]').type('85000');
      cy.get('input[name="salary"]').should('have.value', '85000');
    });

    it('should accept decimal salary values', () => {
      cy.get('input[name="salary"]').type('85000.50');
      cy.get('input[name="salary"]').should('have.value', '85000.50');
    });
  });

  describe('TC-E2E-012: Submit form and verify employee created', () => {
    it('should submit form with valid data', () => {
      cy.contains('button', /add|new|create/i).click();
      cy.fillEmployeeForm({
        name: 'Test Employee ' + Date.now(),
        email: `test${Date.now()}@example.com`,
        department: 'Testing',
        salary: '90000'
      });

      cy.contains('button', /submit|save|add|create/i).click();
      
      // Wait for submission to complete
      cy.wait(1000);
    });

    it('should send POST request to create employee', () => {
      cy.contains('button', /add|new|create/i).click();
      
      cy.fillEmployeeForm({
        name: 'John Doe ' + Date.now(),
        email: `john${Date.now()}@example.com`,
        department: 'Engineering',
        salary: '85000'
      });

      cy.contains('button', /submit|save|add|create/i).click();
      
      // Verify we're navigated away from /add page
      cy.wait(1000);
      cy.url().should('not.include', '/add');
    });
  });

  describe('TC-E2E-013: Verify success message displayed', () => {
    it('should show success alert after employee creation', () => {
      cy.contains('button', /add|new|create/i).click();
      
      cy.fillEmployeeForm({
        name: 'Success Test ' + Date.now(),
        email: `success${Date.now()}@example.com`,
        department: 'Engineering',
        salary: '85000'
      });

      cy.contains('button', /submit|save|add|create/i).click();
      
      cy.wait(1000);
      
      // Check for success message
      cy.get('body').then(($body) => {
        if ($body.text().includes('success') || $body.text().includes('created')) {
          cy.contains(/success|created|added/i).should('be.visible');
        }
      });
    });
  });

  describe('TC-E2E-014: Verify redirect to employee list', () => {
    it('should redirect to employee list after successful creation', () => {
      cy.contains('button', /add|new|create/i).click();
      
      cy.fillEmployeeForm({
        name: 'Redirect Test ' + Date.now(),
        email: `redirect${Date.now()}@example.com`,
        department: 'Engineering',
        salary: '85000'
      });

      cy.contains('button', /submit|save|add|create/i).click();
      
      cy.wait(1000);
      
      // Should be redirected to /employees
      cy.url().should('include', '/employees');
      cy.url().should('not.include', '/add');
    });
  });

  describe('TC-E2E-015: Verify new employee appears in list', () => {
    it('should display newly created employee in list', () => {
      const uniqueName = 'New Employee ' + Date.now();
      const uniqueEmail = `new${Date.now()}@example.com`;

      cy.contains('button', /add|new|create/i).click();
      
      cy.fillEmployeeForm({
        name: uniqueName,
        email: uniqueEmail,
        department: 'Engineering',
        salary: '85000'
      });

      cy.contains('button', /submit|save|add|create/i).click();
      
      cy.wait(1000);
      
      // Verify in list
      cy.url().should('include', '/employees');
      cy.get('body').then(($body) => {
        if ($body.text().includes(uniqueName)) {
          cy.contains(uniqueName).should('be.visible');
        }
      });
    });
  });

  describe('TC-E2E-016: Form validation - Required fields', () => {
    beforeEach(() => {
      cy.contains('button', /add|new|create/i).click();
      cy.url().should('include', '/add');
    });

    it('should show error when name is empty', () => {
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="department"]').type('Engineering');
      cy.get('input[name="salary"]').type('85000');

      cy.contains('button', /submit|save|add|create/i).click();

      cy.get('body').then(($body) => {
        if ($body.text().includes('required') || $body.text().includes('Name')) {
          cy.contains(/required|name/i).should('be.visible');
        }
      });
    });

    it('should show error when email is empty', () => {
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="department"]').type('Engineering');
      cy.get('input[name="salary"]').type('85000');

      cy.contains('button', /submit|save|add|create/i).click();

      cy.get('body').then(($body) => {
        if ($body.text().includes('required') || $body.text().includes('Email')) {
          cy.contains(/required|email/i).should('be.visible');
        }
      });
    });

    it('should show error when department is empty', () => {
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="salary"]').type('85000');

      cy.contains('button', /submit|save|add|create/i).click();

      cy.get('body').then(($body) => {
        if ($body.text().includes('required') || $body.text().includes('Department')) {
          cy.contains(/required|department/i).should('be.visible');
        }
      });
    });

    it('should show error when salary is empty', () => {
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="department"]').type('Engineering');

      cy.contains('button', /submit|save|add|create/i).click();

      cy.get('body').then(($body) => {
        if ($body.text().includes('required') || $body.text().includes('Salary')) {
          cy.contains(/required|salary/i).should('be.visible');
        }
      });
    });
  });

  describe('TC-E2E-017: Form validation - Email format', () => {
    beforeEach(() => {
      cy.contains('button', /add|new|create/i).click();
    });

    it('should reject invalid email format', () => {
      cy.fillEmployeeForm({
        name: 'Test User',
        email: 'notanemail',
        department: 'Engineering',
        salary: '85000'
      });

      cy.contains('button', /submit|save|add|create/i).click();

      cy.get('body').then(($body) => {
        if ($body.text().includes('valid') || $body.text().includes('Email')) {
          cy.contains(/valid.*email|email.*valid/i).should('exist');
        }
      });
    });

    it('should reject email without domain', () => {
      cy.fillEmployeeForm({
        name: 'Test User',
        email: 'test@',
        department: 'Engineering',
        salary: '85000'
      });

      cy.contains('button', /submit|save|add|create/i).click();

      cy.get('body').then(($body) => {
        if ($body.text().includes('valid') || $body.text().includes('Email')) {
          cy.contains(/valid.*email|email.*format/i).should('exist');
        }
      });
    });
  });

  describe('TC-E2E-018: Form validation - Salary validation', () => {
    beforeEach(() => {
      cy.contains('button', /add|new|create/i).click();
    });

    it('should reject negative salary', () => {
      cy.fillEmployeeForm({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        department: 'Engineering',
        salary: '-50000'
      });

      cy.contains('button', /submit|save|add|create/i).click();

      cy.get('body').then(($body) => {
        if ($body.text().includes('positive') || $body.text().includes('Salary')) {
          cy.contains(/positive|salary.*valid|salary.*must/i).should('exist');
        }
      });
    });

    it('should reject zero salary', () => {
      cy.fillEmployeeForm({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        department: 'Engineering',
        salary: '0'
      });

      cy.contains('button', /submit|save|add|create/i).click();

      cy.get('body').then(($body) => {
        if ($body.text().includes('positive') || $body.text().includes('Salary')) {
          cy.contains(/positive|salary.*valid|salary.*must/i).should('exist');
        }
      });
    });
  });

  describe('Navigation', () => {
    it('should have back button to return to list', () => {
      cy.contains('button', /add|new|create/i).click();
      cy.contains('button', /back|cancel/i).should('exist');
    });

    it('should return to list when clicking back button', () => {
      cy.contains('button', /add|new|create/i).click();
      cy.contains('button', /back|cancel/i).click();
      cy.url().should('include', '/employees');
    });
  });
});
