/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { useProducts } from './useProducts';
import * as api from '../services/api';

describe('useProducts Hook (State Management & Race Conditions)', () => {
  const originalError = console.error;

  beforeAll(() => {
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
      true;
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === 'string' && args[0].includes('act')) return;
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

  it('should debounce search query changes before calling API', async () => {
    vi.useFakeTimers();
    const fetchSpy = vi.spyOn(api, 'fetchProducts').mockResolvedValue([]);

    const { rerender } = renderHook(({ query }) => useProducts(emptyFilters, query), {
      initialProps: { query: '' },
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    rerender({ query: 'Q' });
    rerender({ query: 'Quick' });

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy).toHaveBeenLastCalledWith(emptyFilters, 'Quick', expect.any(AbortSignal));

    vi.useRealTimers();
  });
});
