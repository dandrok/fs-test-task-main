/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useDebounce } from './useDebounce';

describe('useDebounce Hook', () => {
  const originalError = console.error;

  beforeAll(() => {
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === 'string' && args[0].includes('act')) return;
      originalError(...args);
    };
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately on first render', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should not update debounced value before the delay finishes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 300 } }
    );

    rerender({ value: 'second', delay: 300 });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Still the old value at 200ms
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Successfully updated at 300ms
    expect(result.current).toBe('second');
  });

  it('should coalesce rapid consecutive value changes into a single update', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'W', delay: 300 } }
    );

    // Rapid keystrokes: W -> WW -> WW90
    rerender({ value: 'WW', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'WW90', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should still be initial value because 300ms has not passed since last keystroke
    expect(result.current).toBe('W');

    // Advance remaining 200ms to complete the debounce for 'WW90'
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('WW90');
  });

  it('should clean up the timer on unmount to prevent state updates', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const { unmount } = renderHook(() => useDebounce('test', 300));

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
