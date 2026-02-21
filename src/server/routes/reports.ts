import express from 'express';
import PDFDocument from 'pdfkit';
import db from '../../db/index.js';
import { authenticateToken, requirePremium, AuthRequest } from '../middleware.js';

const router = express.Router();

router.get('/ramadan', authenticateToken, requirePremium, (req: AuthRequest, res) => {
  const userId = req.user?.id;
  
  try {
    // Fetch data
    const ibadahLogs = db.prepare('SELECT * FROM ibadah_logs WHERE user_id = ? ORDER BY date').all(userId) as any[];
    const expenses = db.prepare('SELECT SUM(amount) as total FROM expenses WHERE user_id = ?').get(userId) as any;
    
    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=ramadan-report.pdf');
    
    doc.pipe(res);
    
    // Title
    doc.fontSize(25).text('MyLifeOS - Ramadan Report', { align: 'center' });
    doc.moveDown();
    
    // Summary
    doc.fontSize(16).text('Summary');
    doc.fontSize(12).text(`Total Expenses: $${expenses.total || 0}`);
    doc.text(`Total Days Logged: ${ibadahLogs.length}`);
    
    // Calculate totals
    const totalTilawah = ibadahLogs.reduce((acc, log) => acc + (log.tilawah || 0), 0);
    const totalSedekah = ibadahLogs.reduce((acc, log) => acc + (log.sedekah || 0), 0);
    
    doc.text(`Total Tilawah (pages): ${totalTilawah}`);
    doc.text(`Total Sedekah: $${totalSedekah}`);
    
    doc.moveDown();
    
    // Table-ish view of logs
    doc.fontSize(14).text('Daily Logs');
    ibadahLogs.forEach(log => {
      doc.fontSize(10).text(`${log.date}: Subuh: ${log.subuh ? 'Yes' : 'No'}, Tilawah: ${log.tilawah}, Sedekah: ${log.sedekah}`);
    });
    
    doc.end();
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
});

// Get dashboard stats
router.get('/dashboard', authenticateToken, (req: AuthRequest, res) => {
  const userId = req.user?.id;
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Today's Ibadah
    const ibadah = db.prepare('SELECT * FROM ibadah_logs WHERE user_id = ? AND date = ?').get(userId, today) as any;
    
    // Habits completion
    const habits = db.prepare('SELECT COUNT(*) as total FROM habits WHERE user_id = ?').get(userId) as any;
    const habitLogs = db.prepare(`
      SELECT COUNT(*) as completed FROM habit_logs 
      WHERE date = ? AND habit_id IN (SELECT id FROM habits WHERE user_id = ?) AND value > 0
    `).get(today, userId) as any;
    
    // Monthly Expenses
    const startOfMonth = today.substring(0, 7) + '-01';
    const expenses = db.prepare('SELECT SUM(amount) as total FROM expenses WHERE user_id = ? AND date >= ?').get(userId, startOfMonth) as any;
    
    // Weekly Ibadah Trend (last 7 days)
    const weeklyTrend = db.prepare(`
      SELECT date, (subuh + dzuhur + ashar + maghrib + isya) as score 
      FROM ibadah_logs 
      WHERE user_id = ? 
      ORDER BY date DESC 
      LIMIT 7
    `).all(userId) as any[];

    res.json({
      ibadah: ibadah || {},
      habits: { total: habits.total, completed: habitLogs.completed },
      expenses: expenses.total || 0,
      weeklyTrend: weeklyTrend.reverse()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

export default router;
