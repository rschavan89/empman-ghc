import { validateField, validateEmployeeForm, isFormValid } from '../utils/validation';

describe('Validation Utilities', () => {
  describe('validateField', () => {
    test('validates required name field', () => {
      expect(validateField('name', '')).toBeTruthy();
      expect(validateField('name', '   ')).toBeTruthy();
      expect(validateField('name', 'John Doe')).toBeNull();
    });

    test('validates email format', () => {
      expect(validateField('email', 'invalid')).toBeTruthy();
      expect(validateField('email', 'test@example.com')).toBeNull();
    });

    test('validates salary is positive', () => {
      expect(validateField('salary', '0')).toBeTruthy();
      expect(validateField('salary', '-100')).toBeTruthy();
      expect(validateField('salary', '50000.50')).toBeNull();
    });

    test('validates department is required', () => {
      expect(validateField('department', '')).toBeTruthy();
      expect(validateField('department', 'Engineering')).toBeNull();
    });

    test('returns null for unknown fields', () => {
      expect(validateField('unknownField', 'value')).toBeNull();
    });
  });

  describe('validateEmployeeForm', () => {
    test('validates complete valid form', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        salary: '50000',
      };
      const errors = validateEmployeeForm(formData);
      expect(isFormValid(errors)).toBe(true);
    });

    test('detects all missing required fields', () => {
      const formData = {
        name: '',
        email: '',
        department: '',
        salary: '',
      };
      const errors = validateEmployeeForm(formData);
      expect(Object.keys(errors).length).toBe(4);
    });

    test('detects multiple validation errors', () => {
      const formData = {
        name: 'John',
        email: 'invalid-email',
        department: 'Eng',
        salary: '-500',
      };
      const errors = validateEmployeeForm(formData);
      expect(errors.email).toBeTruthy();
      expect(errors.salary).toBeTruthy();
    });
  });

  describe('isFormValid', () => {
    test('returns true when no errors', () => {
      expect(isFormValid({})).toBe(true);
    });

    test('returns false when errors exist', () => {
      expect(isFormValid({ name: 'Name is required' })).toBe(false);
    });
  });
});
