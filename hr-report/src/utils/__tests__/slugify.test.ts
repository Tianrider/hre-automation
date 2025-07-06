import { slugify } from '../slugify';

describe('slugify', () => {
  it('converts spaces to dashes and lowercases', () => {
    expect(slugify('John Doe')).toBe('john-doe');
  });
  it('removes special characters', () => {
    expect(slugify('Jane!@# $%^&*()_+Doe')).toBe('jane-doe');
  });
  it('trims leading and trailing dashes', () => {
    expect(slugify('  John   ')).toBe('john');
  });
  it('handles multiple spaces and dashes', () => {
    expect(slugify('John   Smith  Doe')).toBe('john-smith-doe');
  });
  it('handles already slugified input', () => {
    expect(slugify('john-smith')).toBe('john-smith');
  });
  it('returns empty string for empty input', () => {
    expect(slugify('')).toBe('');
  });
}); 