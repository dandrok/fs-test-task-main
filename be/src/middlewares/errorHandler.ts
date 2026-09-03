import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      details: z.flattenError(err).fieldErrors,
    });
    return;
  }

  console.error('[Error Pipeline]', err.stack || err.message);

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.',
  });
};
