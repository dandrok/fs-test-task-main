import { Product } from '../models/product.model';
import { mockData } from './data';

export const seedIfEmpty = async (): Promise<void> => {
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log('[Database] Products collection empty. Auto-seeding initial catalog...');
    try {
      await Product.insertMany(mockData);
      console.log('[Database] Auto-seed complete.');
    } catch (error: unknown) {
      const err = error as { code?: number; name?: string };
      if (err.code === 11000 || err.name === 'MongoBulkWriteError') {
        console.log('[Database] Catalog already seeded by another concurrent instance.');
        return;
      }
      throw error;
    }
  }
};
