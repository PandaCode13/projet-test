import z from 'zod';
import { loginSchema, registerSchema } from './user.validation.js';

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
