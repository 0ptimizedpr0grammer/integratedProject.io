const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');
const { sha256Hash, aesEncrypt } = require('../security/crypto');

const db = new Database(path.join(__dirname, 'wastecity.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'analyst', created_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS cities (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, state TEXT NOT NULL, population INTEGER, lat REAL, lng REAL, tier INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS waste_zones (id INTEGER PRIMARY KEY AUTOINCREMENT, city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE, name TEXT NOT NULL, area_sq_km REAL, waste_type TEXT DEFAULT 'mixed', notes_enc TEXT, created_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS waste_records (id INTEGER PRIMARY KEY AUTOINCREMENT, city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE, zone_id INTEGER REFERENCES waste_zones(id) ON DELETE SET NULL, recorded_date TEXT NOT NULL, waste_kg REAL NOT NULL, recycled_kg REAL DEFAULT 0, waste_type TEXT DEFAULT 'mixed', collector_name TEXT, integrity_hash TEXT, created_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS audit_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER REFERENCES users(id), action TEXT NOT NULL, resource TEXT NOT NULL, ip_address TEXT, payload_hash TEXT, created_at TEXT DEFAULT (datetime('now')));
  CREATE TABLE IF NOT EXISTS transcripts (id INTEGER PRIMARY KEY AUTOINCREMENT, city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE, title TEXT NOT NULL, content_enc TEXT NOT NULL, integrity_hash TEXT NOT NULL, generated_by TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')));
  CREATE INDEX IF NOT EXISTS idx_wr_city ON waste_records(city_id);
  CREATE INDEX IF NOT EXISTS idx_wr_date ON waste_records(recorded_date);
`);

if (db.prepare('SELECT COUNT(*) as c FROM cities').get().c === 0) {
  const iU = db.prepare('INSERT INTO users (username,password,role) VALUES (?,?,?)');
  iU.run('admin',   bcrypt.hashSync('admin123',  10), 'admin');
  iU.run('analyst', bcrypt.hashSync('analyst123',10), 'analyst');

  const iC = db.prepare('INSERT INTO cities (name,state,population,lat,lng,tier) VALUES (?,?,?,?,?,?)');
  const cities = [
    ['Mumbai','Maharashtra',20667656,19.0760,72.8777,1],
    ['Delhi','Delhi',32941000,28.6139,77.2090,1],
    ['Bangalore','Karnataka',12765000,12.9716,77.5946,1],
    ['Chennai','Tamil Nadu',7088000,13.0827,80.2707,1],
    ['Hyderabad','Telangana',9746000,17.3850,78.4867,1],
    ['Pune','Maharashtra',6629000,18.5204,73.8567,2],
    ['Ahmedabad','Gujarat',7681000,23.0225,72.5714,2],
    ['Kolkata','West Bengal',14850000,22.5726,88.3639,1],
    ['Jaipur','Rajasthan',3073350,26.9124,75.7873,2],
    ['Surat','Gujarat',6573000,21.1702,72.8311,2],
  ];
  const cityIds = cities.map(c => iC.run(...c).lastInsertRowid);

  const iZ = db.prepare('INSERT INTO waste_zones (city_id,name,area_sq_km,waste_type,notes_enc) VALUES (?,?,?,?,?)');
  const zoneNames = ['North Industrial','Central Market','South Residential','East Commercial','West Suburban'];
  const zoneTypes = ['mixed','organic','plastic','metal','paper'];
  const zoneIds = [];
  for (const cid of cityIds) {
    for (let i = 0; i < 5; i++) {
      const r = iZ.run(cid, zoneNames[i], (2.5+i*0.8).toFixed(1), zoneTypes[i], aesEncrypt(`Zone ${zoneNames[i]} managed by civic body.`));
      zoneIds.push({ zoneId: r.lastInsertRowid, cityId: cid });
    }
  }

  const iR = db.prepare('INSERT INTO waste_records (city_id,zone_id,recorded_date,waste_kg,recycled_kg,waste_type,collector_name,integrity_hash) VALUES (?,?,?,?,?,?,?,?)');
  const collectors = ['Team Alpha','Team Beta','Team Gamma','Team Delta'];
  for (const cid of cityIds) {
    const czones = zoneIds.filter(z => z.cityId === cid);
    for (let d = 89; d >= 0; d--) {
      const dt = new Date(); dt.setDate(dt.getDate()-d);
      const dateStr = dt.toISOString().split('T')[0];
      for (const {zoneId} of czones) {
        const wk = Math.round((300 + Math.random()*700)*10)/10;
        const rk = Math.round(wk*(0.2+Math.random()*0.25)*10)/10;
        iR.run(cid, zoneId, dateStr, wk, rk, zoneTypes[Math.floor(Math.random()*5)], collectors[Math.floor(Math.random()*4)], sha256Hash(`${cid}-${zoneId}-${dateStr}-${wk}`));
      }
    }
  }
  console.log('✅ Seeded: 10 cities, 50 zones, 45000+ records.');
}

module.exports = db;