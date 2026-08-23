import { Router } from 'express';
import {
  getStats,
  getRecent,
  getTechnologyDistribution,
  getDomainDistribution,
  getCriticalityDistribution,
  getStatusDistribution,
} from '../controllers/dashboard.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/stats', getStats);
router.get('/recent', getRecent);
router.get('/technology-distribution', getTechnologyDistribution);
router.get('/domain-distribution', getDomainDistribution);
router.get('/criticality-distribution', getCriticalityDistribution);
router.get('/status-distribution', getStatusDistribution);

export default router;
