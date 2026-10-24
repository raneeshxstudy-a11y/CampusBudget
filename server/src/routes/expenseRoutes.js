import { Router } from 'express';
import { createExpense, deleteExpense, getExpense, listExpenses, updateExpense } from '../controllers/expenseController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
router.use(requireAuth);
router.get('/', listExpenses);
router.post('/', createExpense);
router.get('/:id', getExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
