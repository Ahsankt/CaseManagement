import express from 'express';
import {
  registerCase,
  getCases,
  getCaseById,
  assignJudge,
  scheduleHearing,
  addCaseOrder,
  updateCaseStatus,
  getDashboardStats
} from '../controllers/caseController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// @route   GET /api/cases/dashboard-stats
router.get('/dashboard-stats', getDashboardStats);

// @route   POST /api/cases - Register new case (Registrar only)
router.post('/', authorize(USER_ROLES.REGISTRAR), registerCase);

// @route   GET /api/cases - Get cases based on user role
router.get('/', getCases);

// @route   GET /api/cases/:id - Get case details
router.get('/:id', getCaseById);

// @route   PUT /api/cases/:id/assign-judge - Assign judge to case
router.put('/:id/assign-judge', 
  authorize(USER_ROLES.REGISTRAR, USER_ROLES.ADMIN), 
  assignJudge
);

// @route   POST /api/cases/:id/hearings - Schedule hearing
router.post('/:id/hearings', 
  authorize(USER_ROLES.JUDGE, USER_ROLES.REGISTRAR), 
  scheduleHearing
);

// @route   POST /api/cases/:id/orders - Add case order (Judge only)
router.post('/:id/orders', 
  authorize(USER_ROLES.JUDGE), 
  addCaseOrder
);

// @route   PUT /api/cases/:id/status - Update case status
router.put('/:id/status', 
  authorize(USER_ROLES.JUDGE, USER_ROLES.REGISTRAR), 
  updateCaseStatus
);

export default router;
