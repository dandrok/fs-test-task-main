/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from './useProducts';
import * as api from '../services/api';

describe('useProducts Hook (State Management & Race Conditions)', () => {
  const originalError = console.error;

  beforeAll(() => {
    console.error = (...args: any[]) => {
      if (typeof args[0] === 'string' && args[0].includes('ReactDOMTestUtils.act')) return;
      originalError(...args);
    };
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const emptyFilters = {
    sort: '' as const,
    capacity: '' as const,
    energyClass: '' as const,
    feature: '' as const,
  };

  it('should start with loading: true and resolve products data', async () => {
    const mockProducts = [{ code: 'TEST1', name: 'Washer 1' } as any];
    vi.spyOn(api, 'fetchProducts').mockResolvedValueOnce(mockProducts);

    const { result } = renderHook(() => useProducts(emptyFilters, ''));

    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
  });

  it('should catch API errors and populate error state with loading: false', async () => {
    vi.spyOn(api, 'fetchProducts').mockRejectedValueOnce(new Error('Network offline'));

    const { result } = renderHook(() => useProducts(emptyFilters, ''));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network offline');
    expect(result.current.products).toEqual([]);
  });

  it('should ignore AbortError during filter changes', async () => {
    const abortErr = new Error('The operation was aborted.');
    abortErr.name = 'AbortError';
    vi.spyOn(api, 'fetchProducts').mockRejectedValueOnce(abortErr);

    const { result } = renderHook(() => useProducts(emptyFilters, ''));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
  });
});
