import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  getLawyers,
  getJudges,
  deactivateUser
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// @route   GET /api/users
router.get('/', authorize(USER_ROLES.REGISTRAR, USER_ROLES.JUDGE), getUsers);

// @route   GET /api/users/lawyers
router.get('/lawyers', getLawyers);

// @route   GET /api/users/judges
router.get('/judges', authorize(USER_ROLES.JUDGE), getJudges);

// @route   GET /api/users/:id
router.get('/:id', getUserById);

// @route   PUT /api/users/:id
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
router.delete('/:id', authorize(USER_ROLES.JUDGE), deactivateUser);

export default router;
