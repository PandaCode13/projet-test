import { config } from 'dotenv';
import z from 'zod';

config();

const envSchema = z.object({
  PORT: z.string().transform((val) => Number(val)).default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  JWT_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  ACCESS_TOKEN_COOKIE_NAME: z.string(),
  REFRESH_TOKEN_COOKIE_NAME: z.string(),
  ACCESS_TOKEN_COOKIE_MAX_AGE: z.string(),
  REFRESH_TOKEN_COOKIE_MAX_AGE: z.string(),
  DB_HOST: z.url(),
  DB_PORT: z.string().default('27017'),
  DB_USERNAME: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_NAME: z.string()
});
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:');
  for (const issue of parsedEnv.error.issues) {
    console.error(`- ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsedEnv.data;
