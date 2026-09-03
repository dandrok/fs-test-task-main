import { Product } from '../models/product.model';
import { ProductQueryFilters } from '../schemas/product.schema';
import { IProduct } from '../types/product';

export const getProducts = async (filters: ProductQueryFilters): Promise<IProduct[]> => {
  const query: Record<string, unknown> = {};

  if (filters.search) {
    query.$or = [
      { code: { $regex: filters.search, $options: 'i' } },
      { name: { $regex: filters.search, $options: 'i' } },
    ];
  }

  if (filters.capacity) {
    query.capacity = filters.capacity;
  }

  if (filters.energyClass) {
    query.energyClass = filters.energyClass;
  }

  if (filters.feature) {
    query.features = filters.feature;
  }

  const sortCriteria: Record<string, 1 | -1> = {};
  if (filters.sort === 'price') {
    sortCriteria['price.value'] = 1;
  } else if (filters.sort === 'capacity') {
    sortCriteria.capacity = 1;
  }

  const products = await Product.find(query).sort(sortCriteria).lean<IProduct[]>();

  return products;
};
