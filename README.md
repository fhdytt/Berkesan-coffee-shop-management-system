# Berkesan — Kopi Berkesan

Aplikasi kasir & pemesanan **Kopi Berkesan**. Frontend dibangun dengan HTML/CSS/JS vanilla, backend Express.js + PostgreSQL.

| Komponen | Platform | URL |
|----------|----------|-----|
| Frontend | Vercel (static) | [berkesan-coffe.vercel.app](https://berkesan-coffe.vercel.app) |
| Backend  | Railway | `https://<nama-project>.up.railway.app` |
| Database | Railway PostgreSQL | (internal Railway) |

---

## Struktur Folder

```
berkesan/
├── index.html              # Landing page
├── vercel.json             # Konfigurasi routing Vercel
├── railway.json            # Konfigurasi Railway deploy
├── package.json            # Dependencies backend
├── Procfile                # Fallback start command
├── src/
│   ├── server.js           # Entry point
│   ├── app.js              # Express app
│   ├── config/
│   │   └── database.js     # Koneksi PostgreSQL (pg Pool)
│   ├── controllers/        # Logic tiap fitur
│   ├── routes/             # Express routes
│   ├── middleware/         # Auth JWT
│   └── utils/
├── database/
│   ├── schema.postgres.sql # DDL schema PostgreSQL
│   └── schema.sql          # Schema MySQL lama (referensi)
├── public/
│   ├── js/
│   │   └── api.config.js   # ⚠️ URL backend Railway
│   ├── pages/              # Halaman HTML
│   └── assets/
├── admin/
│   └── index.html          # Dashboard admin
└── kasir/
    └── index.html          # Dashboard kasir
```

---

## Setup Lokal

### 1. Clone & install

```bash
git clone <repo-url>
cd berkesan
npm install
```

### 2. Buat file `.env`

```bash
cp .env.example .env
```

Isi variabel:

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/berkesan
JWT_SECRET=secret_min_32_karakter
FRONTEND_URL=http://localhost:5500
```

### 3. Siapkan database PostgreSQL lokal

```bash
psql -U postgres -c "CREATE DATABASE berkesan;"
psql -U postgres -d berkesan -f database/schema.postgres.sql
```

### 4. Jalankan backend

```bash
npm run dev
```

Backend berjalan di `http://localhost:3000`.

### 5. Jalankan frontend

Buka `index.html` via Live Server atau:

```bash
npx serve .
```

Pastikan `public/js/api.config.js` mengarah ke `http://localhost:3000`.

---

## Deploy ke Railway (Backend + Database)

### Pertama kali

1. Buka [railway.app](https://railway.app) → **New Project**
2. **Deploy from GitHub repo** → pilih repo ini
3. Tambah plugin **PostgreSQL**: klik **+ Add Service → Database → PostgreSQL**
4. Railway otomatis menyuntikkan `DATABASE_URL` ke environment backend
5. Tambah environment variables di Railway dashboard:

   | Variable | Value |
   |----------|-------|
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | *(generate random string 32+ karakter)* |
   | `FRONTEND_URL` | `https://berkesan-coffe.vercel.app` |
   | `PORT` | *(biarkan Railway yang set, atau hapus — Railway inject otomatis)* |

6. Buka tab **Variables → Show All** dan pastikan `DATABASE_URL` sudah terisi oleh plugin PostgreSQL
7. Klik **Deploy**

### Inisialisasi schema database

Setelah deploy pertama, jalankan schema via Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Jalankan schema
railway run psql $DATABASE_URL -f database/schema.postgres.sql
```

Atau dari Railway dashboard → PostgreSQL service → **Query** tab, paste isi `database/schema.postgres.sql`.

### Update setelah perubahan

```bash
git add .
git commit -m "pesan commit"
git push
```

Railway otomatis redeploy setiap push ke branch utama.

---

## Deploy ke Vercel (Frontend)

### Pertama kali

1. Update `public/js/api.config.js` dengan URL Railway backend:

   ```js
   const BACKEND_URL = "https://<nama-project>.up.railway.app";
   ```

2. Push ke GitHub
3. Buka [vercel.com](https://vercel.com) → **Import Project** dari GitHub
4. Framework preset: **Other** (static site)
5. Root directory: `/` (root folder)
6. Klik **Deploy**

### Update URL backend

```bash
# Edit api.config.js dengan URL Railway terbaru
git add public/js/api.config.js
git commit -m "update backend url"
git push
```

Vercel otomatis redeploy.

---

## Alur Sistem

```
Pelanggan → /order → pilih menu → submit order
                                        ↓
                              Railway Backend (Express)
                                        ↓
                              Railway PostgreSQL
                                        ↓
Kasir → /kasir → lihat order masuk → proses & bayar
Admin → /admin → dashboard penjualan, kelola menu & meja
```

---

## API Endpoints

| Method | Path | Deskripsi | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/login` | Login | — |
| POST | `/api/auth/register` | Daftar user | Admin |
| GET | `/api/menu` | Daftar menu aktif | — |
| POST | `/api/order` | Buat order baru | — |
| GET | `/api/kasir/orders` | Order hari ini | Kasir |
| PATCH | `/api/kasir/orders/:id` | Update status order | Kasir |
| GET | `/api/dashboard/stats` | Statistik dashboard | Admin |
| GET | `/api/dashboard/rekap` | Rekap bulanan | Admin |

Detail lengkap: [`src/API_DOCUMENTATION.md`](src/API_DOCUMENTATION.md)
