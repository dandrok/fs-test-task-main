import express, { Application } from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/products', productRoutes);

app.use(errorHandler);

export default app;
