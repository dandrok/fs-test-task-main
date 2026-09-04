import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../app';
import * as productService from '../services/product.service';

describe('Express API HTTP Endpoints', () => {
  it('GET /health - should return 200 OK with status: ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api/products - should return 400 Bad Request on invalid energyClass', async () => {
    const res = await request(app).get('/api/products?energyClass=INVALID');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
    expect(res.body.details).toHaveProperty('energyClass');
  });

  it('GET /api/products - should return 400 Bad Request on unsupported capacity', async () => {
    const res = await request(app).get('/api/products?capacity=999');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
    expect(res.body.details.capacity[0]).toContain('Capacity must be one of');
  });

  it('GET /api/products - should return 200 OK with product list when valid', async () => {
    vi.spyOn(productService, 'getProducts').mockResolvedValueOnce([
      {
        code: 'TEST123',
        name: 'Mock Washer',
        color: 'white',
        capacity: 9,
        dimensions: '55 x 60 x 85 cm',
        features: ['Silnik inwerterowy'],
        energyClass: 'A',
        price: {
          value: 1999,
          currency: 'zł',
          installment: { value: 50, period: 40 },
          validFrom: new Date(),
          validTo: new Date(),
        },
        image: 'https://example.com/test.jpg',
      },
    ]);

    const res = await request(app).get('/api/products?energyClass=A&capacity=9');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].code).toBe('TEST123');
  });
});
