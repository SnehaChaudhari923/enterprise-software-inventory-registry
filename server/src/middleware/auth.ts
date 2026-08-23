import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { db } from '../services/db.service.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
      return;
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };

    const user = await db.findUserById(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid session or user account not found.',
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Session has expired. Please log in again.',
      });
      return;
    }
    res.status(401).json({
      success: false,
      message: 'Invalid or malformed authentication token.',
    });
  }
};
