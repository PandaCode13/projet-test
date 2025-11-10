import z from 'zod';

export const productsQuerySchema = z.object({
  query: z.object({
    query: z.string({ error: 'Search query is required' }),
    page: z.string().optional(),
    external: z.enum(['true', 'false']).optional()
  })
});

export const createProductSchema = z.object({
  body: z.object({
    barcode: z.string({ error: 'Product code is required' }),
    name: z.string({ error: 'Product name is required' }),
    brand: z.string().optional(),
    imageUrl: z.url().optional(),
    sugar: z.number().optional(),
    calories: z.number().optional(),
    caffeine: z.number().optional()
  })
});
