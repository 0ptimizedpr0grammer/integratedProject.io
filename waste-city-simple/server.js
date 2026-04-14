require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/cities',    require('./routes/cities'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/security',  require('./routes/security'));
app.use('/api/query',     require('./routes/query'));

app.get('/',          (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public/pages/dashboard.html')));
app.get('/map',       (req, res) => res.sendFile(path.join(__dirname, 'public/pages/map.html')));
app.get('/security',  (req, res) => res.sendFile(path.join(__dirname, 'public/pages/security.html')));
app.get('/query',     (req, res) => res.sendFile(path.join(__dirname, 'public/pages/query.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`WasteCity running at http://localhost:${PORT}`));