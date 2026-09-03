import { FiltersContextType } from 'contexts/filters';
import { IProduct } from 'interfaces/product';
import { useState, useEffect } from 'react';
import { fetchProducts } from 'services/api';

export const useProducts = (filters: FiltersContextType['filters'], query: string) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchProducts(filters, query, controller.signal);
        setProducts(data);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    return () => controller.abort();
  }, [filters, query]);

  return { products, loading, error };
};
