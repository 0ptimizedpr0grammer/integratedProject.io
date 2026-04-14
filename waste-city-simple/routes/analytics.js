const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

router.get('/:cityId/trend', (req, res) => {
  const days = Math.min(parseInt(req.query.days) || 30, 365);
  res.json(db.prepare(`
    SELECT recorded_date as date, ROUND(SUM(waste_kg),2) as total_waste_kg
    FROM waste_records
    WHERE city_id = ? AND recorded_date >= date('now','-' || ? || ' days')
    GROUP BY recorded_date ORDER BY recorded_date
  `).all(req.params.cityId, days));
});

router.get('/:cityId/zones', (req, res) => {
  res.json(db.prepare(`
    SELECT wz.name as zone_name,
           ROUND(SUM(wr.waste_kg),2)    as total_waste_kg,
           ROUND(SUM(wr.recycled_kg),2) as total_recycled_kg,
           ROUND(SUM(wr.recycled_kg)*100.0/NULLIF(SUM(wr.waste_kg),0),1) as recycling_pct
    FROM waste_records wr
    JOIN waste_zones wz ON wr.zone_id = wz.id
    WHERE wr.city_id = ?
    GROUP BY wz.id ORDER BY total_waste_kg DESC
  `).all(req.params.cityId));
});

router.get('/:cityId/recycling', (req, res) => {
  res.json(db.prepare(`
    SELECT ROUND(SUM(recycled_kg),2) as recycled_kg,
           ROUND(SUM(waste_kg)-SUM(recycled_kg),2) as landfill_kg,
           ROUND(SUM(recycled_kg)*100.0/NULLIF(SUM(waste_kg),0),1) as recycling_pct
    FROM waste_records WHERE city_id = ?
  `).get(req.params.cityId));
});

module.exports = router;