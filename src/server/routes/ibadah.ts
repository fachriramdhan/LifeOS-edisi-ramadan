import express from 'express';
import db from '../../db/index.js';
import { authenticateToken, AuthRequest } from '../middleware.js';

const router = express.Router();

// Get Ibadah log for a specific date
router.get('/:date', authenticateToken, (req: AuthRequest, res) => {
  const { date } = req.params;
  const userId = req.user?.id;

  try {
    const stmt = db.prepare('SELECT * FROM ibadah_logs WHERE user_id = ? AND date = ?');
    const log = stmt.get(userId, date);
    res.json(log || {});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ibadah log' });
  }
});

// Create or update Ibadah log
router.post('/', authenticateToken, (req: AuthRequest, res) => {
  const { date, subuh, dzuhur, ashar, maghrib, isya, tarawih, tahajud, tilawah, sedekah } = req.body;
  const userId = req.user?.id;

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO ibadah_logs (user_id, date, subuh, dzuhur, ashar, maghrib, isya, tarawih, tahajud, tilawah, sedekah)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, date) DO UPDATE SET
      subuh=excluded.subuh, dzuhur=excluded.dzuhur, ashar=excluded.ashar, maghrib=excluded.maghrib, isya=excluded.isya,
      tarawih=excluded.tarawih, tahajud=excluded.tahajud, tilawah=excluded.tilawah, sedekah=excluded.sedekah
    `);
    
    stmt.run(userId, date, subuh ? 1 : 0, dzuhur ? 1 : 0, ashar ? 1 : 0, maghrib ? 1 : 0, isya ? 1 : 0, 
             tarawih ? 1 : 0, tahajud ? 1 : 0, tilawah || 0, sedekah || 0);
    
    res.json({ message: 'Ibadah log updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating ibadah log' });
  }
});

export default router;
