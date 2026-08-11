import { formatCurrency, formatDate, truncateText, capitalize } from '../utils/formatting';

describe('Formatting Utilities', () => {
  describe('formatCurrency', () => {
    test('formats number as USD currency', () => {
      expect(formatCurrency(50000)).toBe('$50,000.00');
      expect(formatCurrency(1000.50)).toBe('$1,000.50');
    });

    test('handles zero salary', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    test('handles null/undefined', () => {
      expect(formatCurrency(null)).toBe('$0.00');
      expect(formatCurrency(undefined)).toBe('$0.00');
    });
  });

  describe('formatDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2026-08-11');
      const result = formatDate(date);
      expect(result).toContain('Aug');
      expect(result).toContain('11');
      expect(result).toContain('2026');
    });

    test('handles null/undefined', () => {
      expect(formatDate(null)).toBe('N/A');
      expect(formatDate(undefined)).toBe('N/A');
    });
  });

  describe('truncateText', () => {
    test('truncates text longer than maxLength', () => {
      const text = 'This is a very long text';
      expect(truncateText(text, 10)).toBe('This is a ...');
    });

    test('does not truncate text shorter than maxLength', () => {
      const text = 'Short';
      expect(truncateText(text, 10)).toBe('Short');
    });

    test('handles null/undefined', () => {
      expect(truncateText(null)).toBe('');
      expect(truncateText(undefined)).toBe('');
    });
  });

  describe('capitalize', () => {
    test('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('engineering')).toBe('Engineering');
    });

    test('handles null/undefined', () => {
      expect(capitalize(null)).toBe('');
      expect(capitalize(undefined)).toBe('');
    });
  });
});
