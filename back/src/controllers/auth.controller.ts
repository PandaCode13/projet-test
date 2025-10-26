import { env } from '#config/index.js';
import { User } from '#models/user.model.js';
import { clearAuthCookies, createJwt, setAuthCookie } from '#utils/auth.js';
import { Request, Response } from 'express-serve-static-core';
import { jwtVerify } from 'jose';

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });
    const newUser = await User.create({ firstName, lastName, email, password });
    // const token = await createJwt(newUser._id.toString());
    // set token in cookie

    res.status(201).json({ message: 'User registered successfully', id: newUser._id });
  } catch (error) {
    console.error('Error registering user: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const [accessToken, refreshToken] = await Promise.all([
      createJwt(user._id.toString(), env.JWT_EXPIRES_IN, env.JWT_SECRET),
      createJwt(user._id.toString(), env.JWT_REFRESH_EXPIRES_IN, env.JWT_REFRESH_SECRET)
    ]);
    setAuthCookie(res, accessToken, refreshToken);
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in user: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies[env.REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });
    const { payload } = await jwtVerify(refreshToken, new TextEncoder().encode(env.JWT_REFRESH_SECRET));
    const userId = payload.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const [accessToken, newRefreshToken] = await Promise.all([
      createJwt(userId, env.JWT_EXPIRES_IN, env.JWT_SECRET),
      createJwt(userId, env.JWT_REFRESH_EXPIRES_IN, env.JWT_REFRESH_SECRET)
    ]);
    setAuthCookie(res, accessToken, newRefreshToken);
    res.status(200).json({ message: 'Token refreshed' });
  } catch (error) {
    console.error('Error refreshing token: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  clearAuthCookies(res);
  res.status(200).json({ message: 'Logout successful' });
};
