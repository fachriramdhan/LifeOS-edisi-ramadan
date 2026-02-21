import express from 'express';
import db from '../../db/index.js';
import { authenticateToken, AuthRequest } from '../middleware.js';

const router = express.Router();

// Get all habits
router.get('/habits', authenticateToken, (req: AuthRequest, res) => {
  const userId = req.user?.id;
  try {
    const habits = db.prepare('SELECT * FROM habits WHERE user_id = ?').all(userId);
    
    // Get logs for today for these habits
    const today = new Date().toISOString().split('T')[0];
    const logs = db.prepare(`
      SELECT habit_id, value FROM habit_logs 
      WHERE date = ? AND habit_id IN (SELECT id FROM habits WHERE user_id = ?)
    `).all(today, userId) as any[];

    const habitsWithLogs = habits.map((habit: any) => ({
      ...habit,
      todayValue: logs.find(l => l.habit_id === habit.id)?.value || 0
    }));

    res.json(habitsWithLogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching habits' });
  }
});

// Create habit
router.post('/habits', authenticateToken, (req: AuthRequest, res) => {
  const { name, target_type, target_value } = req.body;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  try {
    // Limit removed - all users can create unlimited habits
    const stmt = db.prepare('INSERT INTO habits (user_id, name, target_type, target_value) VALUES (?, ?, ?, ?)');
    stmt.run(userId, name, target_type || 'daily', target_value || 1);
    res.status(201).json({ message: 'Habit created' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating habit' });
  }
});

// Log habit
router.post('/habits/:id/log', authenticateToken, (req: AuthRequest, res) => {
  const { id } = req.params;
  const { date, value } = req.body;
  
  try {
    const stmt = db.prepare(`
      INSERT INTO habit_logs (habit_id, date, value) VALUES (?, ?, ?)
      ON CONFLICT(habit_id, date) DO UPDATE SET value=excluded.value
    `);
    stmt.run(id, date, value);
    res.json({ message: 'Habit logged' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging habit' });
  }
});

// Delete habit
router.delete('/habits/:id', authenticateToken, (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  
  try {
    const stmt = db.prepare('DELETE FROM habits WHERE id = ? AND user_id = ?');
    const info = stmt.run(id, userId);
    if (info.changes === 0) return res.status(404).json({ message: 'Habit not found' });
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting habit' });
  }
});

export default router;
