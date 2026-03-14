import { describe, it, expect } from 'vitest';

// Utility functions to test
function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format USD amounts', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(99.99)).toBe('$99.99');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });
  });

  describe('formatDate', () => {
    it('should format date strings', () => {
      expect(formatDate('2026-03-13')).toContain('Mar');
      expect(formatDate('2026-03-13')).toContain('2026');
    });
  });

  describe('getInitials', () => {
    it('should return uppercase initials', () => {
      expect(getInitials('John', 'Doe')).toBe('JD');
      expect(getInitials('sara', 'campbell')).toBe('SC');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
      expect(truncate('Hi', 5)).toBe('Hi');
    });
  });

  describe('slugify', () => {
    it('should create URL-safe slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('My Cool Form!')).toBe('my-cool-form');
    });
  });
});
