import z from 'zod';

export const createConsumptionSchema = z.object({
  body: z.object({
    product: z.object({
      barcode: z.string({ error: 'Product code is required' }),
      name: z.string({ error: 'Product name is required' }),
      brand: z.string().optional(),
      imageUrl: z.url().optional(),
      sugar: z.number().optional(),
      calories: z.number().optional(),
      caffeine: z.number().optional()
    }),
    consumption: z.object({
      date: z.string({ error: 'Date is required' }),
      quantity: z.number({ error: 'Quantity is required' }),
      place: z.string().optional(),
      notes: z.string().optional()
    })
  })
});
