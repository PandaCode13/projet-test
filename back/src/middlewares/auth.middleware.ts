import { env } from '#config/index.js';
import { AuthRequest } from '#types/index.js';
import { Response, NextFunction } from 'express-serve-static-core';
import { jwtVerify } from 'jose';

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies[env.ACCESS_TOKEN_COOKIE_NAME];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const { payload } = await jwtVerify(token, new TextEncoder().encode(env.JWT_SECRET));
    req.userId = payload.sub;
    next();
  } catch (error) {
    console.error('Error verifying token: ', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
