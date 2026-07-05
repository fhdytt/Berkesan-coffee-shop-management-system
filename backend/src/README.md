# Backend — Berkesan

Backend dibangun dengan **Node.js + Express**, database **PostgreSQL** via `pg` Pool.

---

## Struktur

```
src/
├── server.js               # Entry point — jalankan HTTP server
├── app.js                  # Express setup: CORS, rate limit, routes
├── config/
│   └── database.js         # pg Pool, konek via DATABASE_URL
├── controllers/
│   ├── authController.js   # Login, register, list/delete user
│   ├── menuController.js   # CRUD menu
│   ├── orderController.js  # Buat & update order (publik)
│   ├── kasirController.js  # Order view & update untuk kasir
│   └── dashboardController.js  # Stats, rekap, stok, meja, laporan
├── routes/
│   ├── authRoutes.js
│   ├── menuRoutes.js
│   ├── orderRoutes.js
│   ├── kasirRoutes.js
│   └── dashboardRoutes.js
├── middleware/
│   ├── auth.js             # Verifikasi JWT
│   └── errorHandler.js
└── utils/
    └── hash.js             # Helper bcrypt hash
```

---

## Environment Variables

| Variable | Keterangan |
|----------|------------|
| `DATABASE_URL` | PostgreSQL connection string (Railway inject otomatis) |
| `JWT_SECRET` | Secret untuk sign JWT (min. 32 karakter) |
| `FRONTEND_URL` | URL frontend Vercel (untuk CORS) |
| `PORT` | Port server (Railway inject otomatis, default 3000) |
| `NODE_ENV` | `production` atau `development` |

---

## Menjalankan Lokal

```bash
npm install
cp .env.example .env   # lalu isi DATABASE_URL, JWT_SECRET, dll
npm run dev
```

Server berjalan di `http://localhost:3000`.

---

## Endpoint Singkat

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| POST | `/api/auth/login` | — | Login |
| GET | `/api/menu` | — | Daftar menu aktif |
| POST | `/api/menu` | — | Tambah menu |
| PUT | `/api/menu/:id` | — | Update menu |
| DELETE | `/api/menu/:id` | — | Hapus/nonaktifkan menu |
| GET | `/api/order` | — | List order |
| POST | `/api/order` | — | Buat order baru |
| PATCH | `/api/order/:id/status` | — | Update status order |
| GET | `/api/kasir/orders` | — | Order hari ini (kasir) |
| PATCH | `/api/kasir/orders/:id/status` | — | Proses/selesaikan order |
| GET | `/api/dashboard/stats` | JWT | Statistik hari ini |
| GET | `/api/dashboard/rekap` | JWT | Rekap bulanan |

Dokumentasi lengkap: [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md)
