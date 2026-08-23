import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.js';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.method} ${req.originalUrl}`,
  });
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  console.error('Unhandled Application Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(ENV.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
