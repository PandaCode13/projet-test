import z from 'zod';
import { loginSchema, registerSchema } from './user.validation.js';
import { productsSchema } from './products.validation.js';

export type RegisterType = z.infer<typeof registerSchema>['body'];
export type LoginType = z.infer<typeof loginSchema>['body'];
export type ProductsQueryType = z.infer<typeof productsSchema>['params'];