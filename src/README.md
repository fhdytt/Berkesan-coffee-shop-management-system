# Berkesan — Backend

Folder ini berisi seluruh kode backend aplikasi Berkesan, dibangun dengan Node.js dan Express.

---

## Struktur Folder

```
src/
├── app.js              # Setup Express, middleware, dan routing
├── server.js           # Entry point — menjalankan server
├── config/
│   └── database.js     # Koneksi MySQL (connection pool)
├── controllers/        # Logic bisnis tiap fitur
│   ├── authController.js
│   ├── menuController.js
│   ├── orderController.js
│   ├── kasirController.js
│   └── dashboardController.js
├── routes/             # Definisi endpoint API
│   ├── authRoutes.js
│   ├── menuRoutes.js
│   ├── orderRoutes.js
│   ├── kasirRoutes.js
│   └── dashboardRoutes.js
├── middleware/
│   ├── auth.js         # Verifikasi JWT token
│   └── errorHandler.js
└── utils/
    └── hash.js         # Helper generate bcrypt hash password
```

---

## Endpoint Tersedia

| Method | Path | Keterangan |
|--------|------|------------|
| POST | `/api/auth/login` | Login |
| GET | `/api/menu` | Daftar menu |
| POST/PUT/DELETE | `/api/menu/:id` | Kelola menu |
| GET/POST | `/api/order` | Daftar & buat order |
| PATCH | `/api/order/:id/status` | Update status order |
| GET | `/api/kasir/orders` | Order hari ini (kasir) |
| GET | `/api/kasir/queue` | Antrian |
| GET | `/api/dashboard/stats` | Statistik dashboard |

Dokumentasi lengkap ada di `API_DOCUMENTATION.md`.
