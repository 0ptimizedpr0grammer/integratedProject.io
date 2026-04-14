# WasteCity — Smart Waste Management Analytics for Indian Smart Cities

   

A full-stack web application for analysing municipal solid waste data across 10 major Indian cities. Built as an academic project covering **Data Analytics**, **Data Structures & Algorithms**, and **Network Security & Cryptography**.

***

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Team & Responsibilities](#team--responsibilities)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Subject Coverage](#subject-coverage)
- [API Reference](#api-reference)
- [Demo Credentials](#demo-credentials)

***

## Project Overview

WasteCity provides city administrators and analysts with a real-time dashboard to monitor waste collection trends, zone-level performance, recycling rates, and data integrity — all secured with industry-standard cryptographic protocols.

The system covers **10 Indian cities**, **50 collection zones**, and over **45,000 waste records** spanning 90 days.

***

## Features

- 📊 **Analytics Dashboard** — KPIs, trend charts, zone comparisons, recycling split
- 🗺️ **Interactive City Map** — Leaflet.js map with per-city waste statistics on click
- 🔐 **Crypto Lab** — Live AES-256-CBC encryption, SHA-256 hashing, RSA-2048 key generation, signing and verification
- 🛡️ **JWT Authentication** — Token-based login with role separation (admin / analyst)
- 📋 **Audit Trail** — Every sensitive action logged with SHA-256 payload hashes
- 💻 **SQL Query Browser** — Run live SELECT queries against the database with syntax safety checks
- 🌙 **Dark UI** — Fully responsive dark-mode interface

***

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Express.js 4.18 |
| Database | SQLite via better-sqlite3 |
| Authentication | JSON Web Tokens (jsonwebtoken) |
| Password hashing | bcryptjs |
| Cryptography | Node.js built-in `crypto` module |
| Frontend charts | Chart.js 4 |
| Map | Leaflet.js 1.9 |
| Fonts | Google Fonts — Inter, JetBrains Mono |

***

## Team & Responsibilities

| # | Name | Role | Responsibilities |
|---|---|---|---|
| 1 | **Member 1** | Backend & API Developer | Express server, REST API routes, JWT auth, database integration, audit logging, query engine |
| 2 | **Member 2** | Frontend & UI Developer | HTML pages, CSS design system, responsive layout, Chart.js visualisations |
| 3 | **Member 3** | Security & Cryptography | AES-256-CBC encryption, SHA-256 integrity hashing, RSA-2048 signing, Crypto Lab page |
| 4 | **Member 4** | Database & Data Analytics | SQLite schema design, seed data generation, aggregation queries, analytics API |
| 5 | **Member 5** | DevOps & Documentation | Project setup, `.env` configuration, GitHub, README, deployment guide, testing |

### Role 1 Deep-Dive — Backend & API ([Your Name])

Responsible for the entire server-side architecture:

- Built `server.js` — Express app wiring all middleware, static files, and route mounting
- Wrote all five route modules: `auth.js`, `cities.js`, `analytics.js`, `security.js`, `query.js`
- Implemented JWT authentication middleware (`middleware/auth.js`) protecting all sensitive endpoints
- Implemented audit logging middleware (`middleware/auditLogger.js`) — hashes payloads with SHA-256 before writing to the database, so raw request data is never stored
- Secured the SQL query endpoint with a keyword blocklist (`DROP`, `DELETE`, `INSERT`, etc.) and enforced SELECT-only access using parameterised prepared statements to prevent SQL injection
- Integrated `dotenv` for environment-based secret management — JWT secret and AES key never hardcoded
- Connected all route modules to the database layer with error handling and correct HTTP status codes

***

## Getting Started

### Prerequisites

- Node.js **v20 LTS** (not v21+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YourUsername/waste-city-simple.git
cd waste-city-simple

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# (or create .env manually — see Environment Variables below)

# Start the server
node server.js
```

The first run seeds the database automatically:
```
✅ Seeded: 10 cities, 50 zones, 45000+ records.
WasteCity running at http://localhost:3000
```

Open **http://localhost:3000** in your browser.

### Environment Variables

Create a `.env` file in the project root:

```
JWT_SECRET=waste-city-super-secret-key-2026
JWT_EXPIRES_IN=24h
AES_KEY=0123456789abcdef0123456789abcdef
PORT=3000
```

### Reset Database

```bash
# Delete the existing database and restart to reseed
del db\wastecity.db      # Windows
rm db/wastecity.db       # Mac/Linux
node server.js
```

***

## Project Structure

```
waste-city-simple/
├── server.js                  # Express app entry point
├── package.json
├── .env                       # Environment secrets (not committed)
├── .gitignore
│
├── db/
│   └── database.js            # SQLite connection, schema, seed data
│
├── security/
│   └── crypto.js              # AES-256, SHA-256, RSA-2048 helpers
│
├── middleware/
│   ├── auth.js                # JWT token verification middleware
│   └── auditLogger.js         # Request audit logging middleware
│
├── routes/
│   ├── auth.js                # POST /api/auth/login, GET /api/auth/me
│   ├── cities.js              # GET /api/cities, /api/cities/:id/summary
│   ├── analytics.js           # Trend, zones, recycling endpoints
│   ├── security.js            # Encrypt, decrypt, hash, RSA, audit log
│   └── query.js               # POST /api/query (SELECT-only SQL runner)
│
└── public/
    ├── index.html             # Login page
    ├── css/
    │   ├── base.css           # Design tokens, reset, layout grid
    │   └── components.css     # Sidebar, cards, buttons, tables, forms
    ├── js/
    │   ├── api.js             # Fetch wrapper for all API calls
    │   ├── auth.js            # Login form, token storage, logout
    │   └── charts.js          # Chart.js render helpers
    └── pages/
        ├── dashboard.html     # KPIs + trend + zone + recycling charts
        ├── map.html           # Leaflet city map with popup stats
        ├── security.html      # Crypto Lab — AES, SHA, RSA, audit log
        └── query.html         # SQL query browser
```

***

## Subject Coverage

### Data Analytics

| Feature | Implementation |
|---|---|
| Time-series trend | Daily SUM(waste_kg) grouped by date over 7–90 days |
| Zone performance | GROUP BY zone with total and recycled aggregates |
| Recycling efficiency | `SUM(recycled_kg) * 100.0 / SUM(waste_kg)` per city and zone |
| City comparison | Multi-city aggregation query with AVG and percentage |
| Live SQL browser | Arbitrary SELECT queries with execution time reporting |

### Data Structures & Algorithms

| Concept | Where Used |
|---|---|
| B-Tree Index | `CREATE INDEX idx_wr_city` — O(log n) city lookups |
| B-Tree Index | `CREATE INDEX idx_wr_date` — O(log n) date range scans |
| Hash Map | JS object lookup for city/zone data on the frontend |
| Relational Tree | cities → zones → records (foreign key cascade graph) |
| Linear Search | Keyword blocklist scan before executing SQL queries |
| Array sorting | `.sort()`, `.filter()`, `.slice()` for chart data preparation |

### Network Security & Cryptography

| Algorithm | Application |
|---|---|
| AES-256-CBC | Encrypts zone notes and transcript content in the database |
| SHA-256 | Integrity hash stored per waste record; audit log payload hashing |
| RSA-2048 | Digital signature generation and verification in Crypto Lab |
| JWT (HS256) | Stateless API authentication with expiry |
| bcrypt | Password hashing with salt rounds before storage |
| Parameterised queries | SQL injection prevention across all database operations |

***

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | None | Login, returns JWT token |
| GET | `/api/auth/me` | Bearer | Get current user info |

### Cities

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/cities` | Bearer | List all cities |
| GET | `/api/cities/:id` | Bearer | Get city by ID |
| GET | `/api/cities/:id/summary` | Bearer | Aggregated waste stats |

### Analytics

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/analytics/:cityId/trend?days=30` | Bearer | Daily waste trend |
| GET | `/api/analytics/:cityId/zones` | Bearer | Per-zone breakdown |
| GET | `/api/analytics/:cityId/recycling` | Bearer | Recycling split |

### Security

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/security/encrypt` | Bearer | AES-256-CBC encrypt |
| POST | `/api/security/decrypt` | Bearer | AES-256-CBC decrypt |
| POST | `/api/security/hash` | None | SHA-256 hash |
| POST | `/api/security/rsa/generate` | Bearer | Generate RSA-2048 key pair |
| POST | `/api/security/rsa/sign` | Bearer | Sign data with private key |
| POST | `/api/security/rsa/verify` | None | Verify signature |
| GET | `/api/security/audit-logs` | Bearer | Last 100 audit entries |

### Query

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/query` | Bearer | Run a SELECT query (500 row cap) |

***

## Demo Credentials

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Full access |
| `analyst` | `analyst123` | Read-only analyst |

***

## License

MIT — free to use for academic and personal projects.
