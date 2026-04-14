const express = require('express');
const router  = express.Router();
const db      = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const BLOCKED = ['DROP','DELETE','INSERT','UPDATE','ALTER','CREATE','ATTACH','DETACH','PRAGMA','VACUUM'];

router.post('/', authenticateToken, (req, res) => {
  const { sql } = req.body;
  if (!sql?.trim()) return res.status(400).json({ error: 'sql is required' });
  const upper = sql.trim().toUpperCase();
  if (!upper.startsWith('SELECT') && !upper.startsWith('WITH'))
    return res.status(403).json({ error: 'Only SELECT queries are allowed' });
  if (BLOCKED.some(k => upper.includes(k)))
    return res.status(403).json({ error: 'Query contains a forbidden keyword' });
  try {
    const t0   = Date.now();
    const rows = db.prepare(sql).all();
    const ms   = Date.now() - t0;
    const limited = rows.slice(0, 500);
    const columns = limited.length ? Object.keys(limited[0]) : [];
    res.json({ columns, rows: limited.map(r => columns.map(c => r[c] ?? null)), rowCount: limited.length, executionTimeMs: ms, truncated: rows.length > 500 });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;