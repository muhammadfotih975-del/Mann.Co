import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initDatabase,
  getRequisitions,
  createRequisition,
  updateRequisitionStatus,
  deleteRequisition,
  likeRequisition,
  getInventory,
  updateInventoryStock,
  getDatabaseStats,
  executeRawSql,
  getSqlSchemaInfo,
  db
} from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize SQLite database
initDatabase();

app.use(express.json());

// Public Forum API (User-filled forum submissions saved in SQL)
app.get('/api/forum', (req: Request, res: Response) => {
  try {
    const { faction, status, search } = req.query;
    const posts = getRequisitions({
      faction: faction ? String(faction) : undefined,
      status: status ? String(status) : undefined,
      search: search ? String(search) : undefined,
    });
    res.json({ success: true, count: posts.length, posts });
  } catch (error: any) {
    console.error('Error fetching requisitions:', error);
    res.status(500).json({ error: error.message || 'Database error fetching forum requisitions' });
  }
});

app.post('/api/forum', (req: Request, res: Response) => {
  try {
    const {
      mercenary_name,
      mercenary_class,
      faction,
      ration_item,
      ration_quantity,
      frontline_sector,
      priority,
      message,
    } = req.body;

    if (!mercenary_name || !message || !frontline_sector || !ration_item) {
      return res.status(400).json({
        error: 'Missing required field: Mercenary Name, Frontline Sector, Ration Item, and Tactical Message are mandatory.'
      });
    }

    const newPost = createRequisition({
      mercenary_name,
      mercenary_class: mercenary_class || 'Heavy Weapons Guy',
      faction: faction || 'RED',
      ration_item,
      ration_quantity: Number(ration_quantity) || 1,
      frontline_sector,
      priority: priority || 'STANDARD',
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Requisition recorded into Mann Co. SQLite ledger!',
      post: newPost
    });
  } catch (error: any) {
    console.error('Error inserting requisition:', error);
    res.status(500).json({ error: error.message || 'Database error storing requisition' });
  }
});

app.post('/api/forum/:id/like', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = likeRequisition(id);
    res.json({ success: true, updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/inventory', (_req: Request, res: Response) => {
  try {
    const items = getInventory();
    res.json({ success: true, items });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Authentication API
// Credentials requested by user: login: admin, password: admin
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    return res.json({
      success: true,
      token: 'mann_co_auth_token_secret_1968',
      adminUser: {
        username: 'admin',
        role: 'Chief Quartermaster',
        clearance: 'Level 5 (Mann Co. Armory Administrator)'
      }
    });
  }
  return res.status(401).json({ error: 'Noto\'g\'ri login yoki parol. (Login: admin, Parol: admin)' });
});

// Admin Protected Middleware Check
const verifyAdmin = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer mann_co_auth_token_secret_1968') {
    // For convenience in prototyping, also allow header 'x-admin-key: admin'
    if (req.headers['x-admin-key'] !== 'admin') {
      return res.status(403).json({ error: 'Ruxsat berilmadi. Admin sifatida tizimga kiring.' });
    }
  }
  next();
};

app.get('/api/admin/stats', verifyAdmin, (_req: Request, res: Response) => {
  try {
    const stats = getDatabaseStats();
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/admin/requisitions/:id', verifyAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, admin_notes } = req.body;
    const updated = updateRequisitionStatus(id, status, admin_notes);
    res.json({ success: true, post: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/requisitions/:id', verifyAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = deleteRequisition(id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/admin/inventory/:id', verifyAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { stock_units } = req.body;
    const updated = updateInventoryStock(id, Number(stock_units));
    res.json({ success: true, item: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Raw SQL Console
app.get('/api/admin/sql-schema', verifyAdmin, (_req: Request, res: Response) => {
  try {
    const schema = getSqlSchemaInfo();
    res.json({ success: true, schema });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/sql-query', verifyAdmin, (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'SQL Query is required' });
    }
    const result = executeRawSql(query);
    res.json({ success: true, result });
  } catch (error: any) {
    console.error('SQL Execution error:', error);
    res.status(400).json({ error: error.message || 'SQL Execution failed' });
  }
});

app.get('/api/admin/logs', verifyAdmin, (_req: Request, res: Response) => {
  try {
    const logs = db.prepare('SELECT * FROM admin_logs ORDER BY id DESC LIMIT 50').all();
    res.json({ success: true, logs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Dev vs Prod Vite Integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Mann Co. Mess Hall Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
