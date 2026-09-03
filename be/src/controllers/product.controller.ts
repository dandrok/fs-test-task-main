import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';
import { ProductQuerySchema } from '../schemas/product.schema';

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters = ProductQuerySchema.parse(req.query);

    const products = await productService.getProducts(filters);

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
