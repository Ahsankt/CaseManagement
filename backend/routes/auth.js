import express from 'express';
import { register, login, getMe, updatePassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/me
router.get('/me', authenticate, getMe);

// @route   PUT /api/auth/password
router.put('/password', authenticate, updatePassword);

export default router;
