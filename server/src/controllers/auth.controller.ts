import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { db } from '../services/db.service.js';
import { AuthRequest } from '../middleware/auth.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username/Email and Password are required',
      });
      return;
    }

    const user = await db.findUserByEmailOrUsername(username);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || 'Enterprise Architecture',
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message,
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
};
