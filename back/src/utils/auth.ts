import { env } from '#config/index.js';
import { SignJWT } from 'jose';
import { Response } from 'express-serve-static-core';

export const createJwt = async (userId: string, age: string, secret: string) => {
  return await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(age)
    .sign(new TextEncoder().encode(secret));
};

export const setAuthCookie = (res: Response, accessToken: string, refreshToken: string) => {
  const isProd = env.NODE_ENV === 'production';
  res.cookie(env.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    maxAge: parseInt(env.ACCESS_TOKEN_COOKIE_MAX_AGE),
    secure: true,
    sameSite: 'none'
  });
  res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    maxAge: parseInt(env.REFRESH_TOKEN_COOKIE_MAX_AGE),
    secure: true,
    sameSite: 'none'
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie(env.ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME);
};
