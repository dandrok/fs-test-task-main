import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchProducts } from './api';
import { FiltersContextType } from '../contexts/filters';

describe('fetchProducts API Client (Edge Cases & Date Hydration)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const emptyFilters: FiltersContextType['filters'] = {
    sort: '',
    capacity: '',
    energyClass: '',
    feature: '',
  };

  it('should build correct query parameters and trim search whitespace', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    await fetchProducts({ ...emptyFilters, capacity: 9, energyClass: 'A' }, '   QuickDrive   ');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain('search=QuickDrive');
    expect(calledUrl).toContain('capacity=9');
    expect(calledUrl).toContain('energyClass=A');
  });

  it('should hydrate string ISO dates into real JavaScript Date instances', async () => {
    const rawBackendProduct = {
      code: 'WW90T754ABC',
      name: 'Pralka QuickDrive',
      price: {
        value: 1999,
        currency: 'zł',
        validFrom: '2021-01-01T00:00:00.000Z',
        validTo: '2021-12-31T00:00:00.000Z',
      },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [rawBackendProduct],
    } as Response);

    const [product] = await fetchProducts(emptyFilters, '');

    expect(product.price.validFrom).toBeInstanceOf(Date);
    expect(product.price.validTo).toBeInstanceOf(Date);
    expect(product.price.validFrom.getFullYear()).toBe(2021);
    expect(() => product.price.validFrom.toLocaleDateString()).not.toThrow();
  });

  it('should throw descriptive Error when HTTP response is not ok (400 / 500)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    } as Response);

    await expect(fetchProducts(emptyFilters, '')).rejects.toThrow(
      'Failed to fetch products: 400 Bad Request'
    );
  });

  it('should forward AbortSignal to native fetch', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    const controller = new AbortController();
    await fetchProducts(emptyFilters, '', controller.signal);

    const fetchOptions = fetchSpy.mock.calls[0][1];
    expect(fetchOptions?.signal).toBe(controller.signal);
  });
});
