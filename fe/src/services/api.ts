import { FiltersContextType } from 'contexts/filters';
import { IProduct } from 'interfaces/product';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchProducts = async (
  filters: FiltersContextType['filters'],
  query: string,
  signal?: AbortSignal
): Promise<IProduct[]> => {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.append('search', query.trim());
  }
  if (filters.capacity) {
    params.append('capacity', filters.capacity.toString());
  }
  if (filters.energyClass) {
    params.append('energyClass', filters.energyClass);
  }
  if (filters.feature) {
    params.append('feature', filters.feature);
  }
  if (filters.sort) {
    params.append('sort', filters.sort);
  }

  const url = `${API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
  }

  const rawData = await response.json();

  const hydratedProducts: IProduct[] = rawData.map((item: any) => ({
    ...item,
    price: {
      ...item.price,
      validFrom: new Date(item.price.validFrom),
      validTo: new Date(item.price.validTo),
    },
  }));

  return hydratedProducts;
};
