import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';
import { seedIfEmpty } from './scripts/seeding';

dotenv.config();

const PORT = process.env.PORT || 5005;

const startServer = async (): Promise<void> => {
  await connectDB();
  await seedIfEmpty();

  app.listen(PORT, () => {
    console.log(`[Server] Express API running on http://localhost:${PORT}`);
  });
};

startServer();
