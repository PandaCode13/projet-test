import z from 'zod';

export const productsSchema = z.object({
  query: z.object({
    query: z.string({ error: 'Search query is required' }),
    page: z.string().optional(),
    external: z.enum(['true', 'false']).optional()
  })
});
