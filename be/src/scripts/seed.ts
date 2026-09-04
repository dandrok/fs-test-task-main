import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Product } from '../models/product.model';
import { mockData } from './data';

dotenv.config();

const seedDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('[Seeder] Error: MONGO_URI is not defined in .env.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB.');

    await Product.deleteMany({});
    console.log('[Seeder] Cleared existing products collection.');

    const inserted = await Product.insertMany(mockData);
    console.log(`[Seeder] Successfully seeded ${inserted.length} products.`);

    await mongoose.connection.close();
    console.log('[Seeder] Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Seeding failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
