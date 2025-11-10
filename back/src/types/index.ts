import z from 'zod';
import { loginSchema, registerSchema } from './user.validation.js';
import { productsQuerySchema, createProductSchema } from './products.validation.js';
import { Request } from 'express-serve-static-core';
import { createConsumptionSchema } from './consumption.validation.js';


export type AuthRequest = Request & { userId?: string };

export type RegisterType = z.infer<typeof registerSchema>['body'];
export type LoginType = z.infer<typeof loginSchema>['body'];
export type ProductsQueryType = z.infer<typeof productsQuerySchema>['query'];
export type CreateProductType = z.infer<typeof createProductSchema>['body'];
export type CreateConsumptionType = z.infer<typeof createConsumptionSchema>['body'];
