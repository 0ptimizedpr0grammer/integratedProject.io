const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM cities ORDER BY name').all());
});

router.get('/:id', (req, res) => {
  const city = db.prepare('SELECT * FROM cities WHERE id = ?').get(req.params.id);
  if (!city) return res.status(404).json({ error: 'City not found' });
  res.json(city);
});

router.get('/:id/summary', (req, res) => {
  const id    = req.params.id;
  const stats = db.prepare(`
    SELECT COUNT(*)                          AS total_records,
           ROUND(SUM(waste_kg),2)            AS total_waste_kg,
           ROUND(AVG(waste_kg),2)            AS avg_daily_waste_kg,
           ROUND(SUM(recycled_kg),2)         AS total_recycled_kg,
           ROUND(SUM(recycled_kg)*100.0/NULLIF(SUM(waste_kg),0),1) AS recycling_pct
    FROM waste_records WHERE city_id = ?
  `).get(id);
  const zones = db.prepare('SELECT COUNT(*) as count FROM waste_zones WHERE city_id = ?').get(id);
  res.json({ ...stats, active_zones: zones.count });
});

module.exports = router;