import { z } from 'zod';
import { ENERGY_CLASSES, CAPACITIES, FEATURES, SORT_OPTIONS, Capacity } from '../types/product';

export const ProductQuerySchema = z.object({
  search: z.string().trim().optional(),
  capacity: z.coerce
    .number()
    .refine((val): val is Capacity => (CAPACITIES as readonly number[]).includes(val), {
      message: `Capacity must be one of: ${CAPACITIES.join(', ')}`,
    })
    .optional(),
  energyClass: z.enum(ENERGY_CLASSES).optional(),
  feature: z.enum(FEATURES).optional(),
  sort: z.enum(SORT_OPTIONS).optional(),
});

export type ProductQueryFilters = z.infer<typeof ProductQuerySchema>;
