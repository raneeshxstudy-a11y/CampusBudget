import { Router } from 'express';
import { getBudget, getSummary, upsertBudget } from '../controllers/budgetController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
router.use(requireAuth);
router.get('/:month/summary', getSummary);
router.get('/:month', getBudget);
router.put('/:month', upsertBudget);

export default router;
