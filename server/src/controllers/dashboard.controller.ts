import { Response } from 'express';
import { db } from '../services/db.service.js';
import { AuthRequest } from '../middleware/auth.js';

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats = await db.getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard statistics',
      error: error.message,
    });
  }
};

export const getRecent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const recent = await db.getRecentSystems(limit);
    res.status(200).json({
      success: true,
      data: recent,
    });
  } catch (error: any) {
    console.error('Recent systems error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve recent systems',
      error: error.message,
    });
  }
};

export const getTechnologyDistribution = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await db.getTechnologyDistribution();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Tech distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve technology distribution',
      error: error.message,
    });
  }
};

export const getDomainDistribution = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await db.getDomainDistribution();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Domain distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve domain distribution',
      error: error.message,
    });
  }
};

export const getCriticalityDistribution = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await db.getCriticalityDistribution();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Criticality distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve criticality distribution',
      error: error.message,
    });
  }
};

export const getStatusDistribution = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await db.getStatusDistribution();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Status distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve status distribution',
      error: error.message,
    });
  }
};
