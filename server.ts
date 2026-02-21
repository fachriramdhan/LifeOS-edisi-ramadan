import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { initDatabase } from './src/db/index.js';
import authRoutes from './src/server/routes/auth.js';
import ibadahRoutes from './src/server/routes/ibadah.js';
import productivityRoutes from './src/server/routes/productivity.js';
import financeRoutes from './src/server/routes/finance.js';
import reportRoutes from './src/server/routes/reports.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB
initDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/ibadah', ibadahRoutes);
  app.use('/api/productivity', productivityRoutes);
  app.use('/api/finance', financeRoutes);
  app.use('/api/reports', reportRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting in Development Mode');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Starting in Production Mode');
    const distPath = path.resolve(process.cwd(), 'dist');
    const indexPath = path.resolve(distPath, 'index.html');
    
    // Production static file serving
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (!fs.existsSync(indexPath)) {
        console.error('Build not found at:', indexPath);
        return res.status(404).send(`
          <h1>App not built</h1>
          <p>The 'dist' folder is missing. Please run <code>npm run build</code> to compile the frontend.</p>
          <p>Checked path: ${indexPath}</p>
        `);
      }
      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
