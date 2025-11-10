import { Request, Response, NextFunction } from 'express-serve-static-core';
import { ZodError, ZodType } from 'zod';

export const validate = (schema: ZodType) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params
    });
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formatted = error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: formatted
      });
    }

    // fallback for other errors
    res.status(500).json({
      error: (error as Error).message || 'Internal server error'
    });
  }
};
