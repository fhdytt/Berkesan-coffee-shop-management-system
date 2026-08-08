# Berkesan Coffee — POS & Ordering System

Point of Sale and table ordering system for Berkesan Coffee Shop.

**Stack:** Express.js · PostgreSQL · Tailwind CSS · Vanilla JS

## Features

- JWT authentication with Admin and Kasir roles
- Menu & category management
- Table management with QR code ordering
- Order flow: order → payment → queue → done
- Auto queue numbering
- Dashboard stats, monthly recap & sales reports
- Receipt printing

---

## Architecture

```
GitHub Repo (monorepo)
├── backend/      → Railway (API + PostgreSQL)
└── frontend/     → Vercel (static HTML/JS/CSS)
```

Frontend berkomunikasi ke backend via `window.API_URL` yang dibaca dari
`<meta name="api-url">` di setiap halaman HTML.

---

## Deploy ke Production

### 1. Backend → Railway

1. Buka [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Pilih repo ini
3. Railway akan otomatis mendeteksi `railway.json` dan menjalankan `node backend/src/server.js`
4. Tambahkan **database**: klik **+ New** → **Database** → **PostgreSQL**
5. Setelah database aktif, Railway otomatis mengisi `DATABASE_URL` di environment variables service backend
6. Tambahkan environment variables berikut di Railway **service backend** (tab **Variables**):

   | Variable | Nilai |
   |---|---|
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | string acak panjang (min 32 karakter) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `BCRYPT_ROUNDS` | `10` |
   | `FRONTEND_URL` | URL Vercel kamu (isi setelah deploy frontend) |
   | `DATABASE_URL` | otomatis dari plugin PostgreSQL Railway |

7. Jalankan schema database via Railway CLI atau Railway Shell:
   ```bash
   psql $DATABASE_URL -f backend/database/schema.postgres.sql
   psql $DATABASE_URL -f backend/database/dummy_data.sql
   ```
8. Catat URL backend Railway (contoh: `https://berkesan-production.up.railway.app`)

---

### 2. Frontend → Vercel

1. Buka [vercel.com](https://vercel.com) → **Add New Project** → import repo ini
2. Pada konfigurasi project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Other
   - Vercel akan otomatis membaca `frontend/vercel.json`
3. Setelah deploy, catat URL Vercel (contoh: `https://berkesan-coffee.vercel.app`)

---

### 3. Sambungkan Frontend ↔ Backend

#### Update meta tag di HTML

Ganti semua `RAILWAY_BACKEND_URL` di file-file berikut dengan URL Railway yang sudah kamu catat:

```
frontend/public/index.html
frontend/public/admin/index.html
frontend/public/kasir/index.html
frontend/public/pages/order.html
frontend/public/pages/login.html
```

Contoh:
```html
<meta name="api-url" content="https://berkesan-production.up.railway.app">
```

#### Update CORS di Railway

Di Railway, tambahkan/update variable `FRONTEND_URL` dengan URL Vercel:
```
FRONTEND_URL=https://berkesan-coffee.vercel.app
```

Lalu **redeploy** backend agar CORS aktif.

---

## Development Lokal

```bash
git clone git@github.com:fhdytt/Berkesan-coffee-shop-management-system.git
cd Berkesan-coffee-shop-management-system
```

Jalankan database dengan Docker:
```bash
docker compose up -d
```

Install dependencies dan jalankan backend:
```bash
npm install
npm run start
```

Buka frontend langsung di browser (pakai Live Server VS Code atau serupa):
```
frontend/public/index.html
```

Server backend berjalan di `http://localhost:3000`. Frontend akan otomatis
menggunakan `http://localhost:3000` sebagai API URL (fallback di `api.config.js`).

## Demo Accounts

| Role  | Username | Password |
|-------|----------|----------|
| Admin | Admin    | admin    |
| Kasir | Kasir    | kasir    |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup and git workflow.
