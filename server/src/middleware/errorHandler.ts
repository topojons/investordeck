import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  error: ApiError | ZodError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));

    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: formattedErrors,
    });
    return void 0;
  }

  const statusCode = (error as ApiError).statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
