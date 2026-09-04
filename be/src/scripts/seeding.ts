import { Product } from '../models/product.model';
import { mockData } from './data';

export const seedIfEmpty = async (): Promise<void> => {
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log('[Database] Products collection empty. Auto-seeding initial catalog...');
    await Product.insertMany(mockData);
    console.log('[Database] Auto-seed complete.');
  }
};
