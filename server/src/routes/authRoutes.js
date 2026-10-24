import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, me, register } from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: { message: 'Too many attempts. Try again later.' } } });

router.post('/register', authLimit, register);
router.post('/login', authLimit, login);
router.get('/me', requireAuth, me);
router.post('/logout', logout);

export default router;
