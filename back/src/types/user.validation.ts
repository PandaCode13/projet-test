import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string({ error: 'Firstname is required' }).trim().min(2),
    lastName: z.string({ error: 'Lastname is required' }).trim().min(2),
    email: z.email({ error: 'Invalid email address' }).trim(),
    password: z
      .string({ error: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters long' })
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email({ error: 'Invalid email address' }).trim(),
    password: z.string({ error: 'Password is required' })
  }),
});
