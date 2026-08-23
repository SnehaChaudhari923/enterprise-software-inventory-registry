import { Router } from 'express';
import {
  getSoftwareList,
  getSoftwareById,
  createSoftware,
  updateSoftware,
  deleteSoftware,
  exportCsv,
} from '../controllers/software.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  softwareSystemSchema,
  softwareSystemUpdateSchema,
  softwareQuerySchema,
} from '../validations/software.validation.js';

const router = Router();

// Protect all software routes with JWT authentication
router.use(authenticateToken);

// CSV Export (Must be before /:id)
router.get('/export/csv', exportCsv);

// CRUD
router.get('/', validateQuery(softwareQuerySchema), getSoftwareList);
router.get('/:id', getSoftwareById);
router.post('/', validateBody(softwareSystemSchema), createSoftware);
router.put('/:id', validateBody(softwareSystemUpdateSchema), updateSoftware);
router.delete('/:id', deleteSoftware);

export default router;
