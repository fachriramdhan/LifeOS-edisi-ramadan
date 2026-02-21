import express from 'express';
import db from '../../db/index.js';
import { authenticateToken, AuthRequest } from '../middleware.js';

const router = express.Router();

// Get expenses
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    const expenses = db.prepare('SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC').all(userId);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses' });
  }
});

// Add expense
router.post('/', authenticateToken, (req: AuthRequest, res) => {
  const { date, amount, category, note } = req.body;
  const userId = req.user?.id;

  try {
    const stmt = db.prepare('INSERT INTO expenses (user_id, date, amount, category, note) VALUES (?, ?, ?, ?, ?)');
    stmt.run(userId, date, amount, category, note);
    res.status(201).json({ message: 'Expense added' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense' });
  }
});

// Delete expense
router.delete('/:id', authenticateToken, (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const stmt = db.prepare('DELETE FROM expenses WHERE id = ? AND user_id = ?');
    const info = stmt.run(id, userId);
    if (info.changes === 0) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense' });
  }
});

export default router;
