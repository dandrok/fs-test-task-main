import { describe, it, expect } from 'vitest';
import { ProductQuerySchema } from './product.schema';
import { ZodError } from 'zod';

describe('ProductQuerySchema (Edge Cases & Validation)', () => {
  it('should accept an empty query and return all undefined filters', () => {
    const parsed = ProductQuerySchema.parse({});
    expect(parsed).toEqual({});
  });

  it('should coerce string numbers to numbers for capacity', () => {
    const parsed = ProductQuerySchema.parse({ capacity: '9' });
    expect(parsed.capacity).toBe(9);
    expect(typeof parsed.capacity).toBe('number');
  });

  it('should reject non-whitelisted capacity values with a clear error', () => {
    expect(() => ProductQuerySchema.parse({ capacity: '12' })).toThrow(ZodError);
    try {
      ProductQuerySchema.parse({ capacity: '12' });
    } catch (err) {
      expect(err).toBeInstanceOf(ZodError);
      const zodErr = err as ZodError;
      expect(zodErr.issues[0].message).toContain('Capacity must be one of');
    }
  });

  it('should trim surrounding whitespace from search strings', () => {
    const parsed = ProductQuerySchema.parse({ search: '   QuickDrive   ' });
    expect(parsed.search).toBe('QuickDrive');
  });

  it('should reject invalid energy class enum values', () => {
    expect(() => ProductQuerySchema.parse({ energyClass: 'G' })).toThrow(ZodError);
  });

  it('should accept valid energy classes (A, B, C)', () => {
    expect(ProductQuerySchema.parse({ energyClass: 'A' }).energyClass).toBe('A');
    expect(ProductQuerySchema.parse({ energyClass: 'B' }).energyClass).toBe('B');
    expect(ProductQuerySchema.parse({ energyClass: 'C' }).energyClass).toBe('C');
  });

  it('should reject unpermitted sort options', () => {
    expect(() => ProductQuerySchema.parse({ sort: 'unsupported' })).toThrow(ZodError);
    expect(ProductQuerySchema.parse({ sort: 'price' }).sort).toBe('price');
  });

  it('should strip unexpected or malicious query parameters', () => {
    const parsed = ProductQuerySchema.parse({
      search: 'Quick',
      maliciousQuery: 'DROP TABLE users;--',
    }) as any;
    expect(parsed.search).toBe('Quick');
    expect(parsed.maliciousQuery).toBeUndefined();
  });
});
