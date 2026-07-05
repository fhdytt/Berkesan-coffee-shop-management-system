# Panduan Kontribusi — Berkesan POS

Dokumen ini menjelaskan cara menyiapkan environment development lokal dan workflow git untuk berkontribusi ke project ini.

---

## Prasyarat

| Tool | Versi | Link |
|------|-------|------|
| Node.js | **20+** | https://nodejs.org |
| Git | Terbaru | https://git-scm.com |
| PostgreSQL | **14+** | https://www.postgresql.org |
| Docker Desktop | Terbaru (opsional) | https://www.docker.com/products/docker-desktop |

---

## Setup Lokal

### 1. Clone Repository

```bash
git clone git@github.com:fhdytt/Berkesan-coffee-shop-management-system.git
cd Berkesan-coffee-shop-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

**Opsi A — PostgreSQL lokal:**

```bash
psql -U postgres -c "CREATE DATABASE berkesan;"
psql -U postgres -d berkesan -f backend/database/schema.postgres.sql
psql -U postgres -d berkesan -f backend/database/dummy_data.sql
```

**Opsi B — Docker:**

Pastikan Docker Desktop sudah berjalan, lalu:

```bash
docker compose up -d
```

Cek container sudah siap:

```bash
docker compose ps
# Status berkesan_db harus "healthy"
```

### 4. Setup Environment

```bash
# Linux / macOS
cp backend/.env.example backend/.env

# Windows (Command Prompt)
copy backend\.env.example backend\.env
```

Buka `backend/.env` dan sesuaikan:

```env
# Jika pakai PostgreSQL lokal
DATABASE_URL=postgresql://postgres:password@localhost:5432/berkesan

# Jika pakai Docker
DATABASE_URL=postgresql://postgres:P@ssw0rd!@localhost:5432/berkesan

JWT_SECRET=ganti_dengan_secret_acak_minimal_32_karakter
PORT=3000
```

### 5. Jalankan Server

```bash
npm run start
```

Server berjalan di **http://localhost:3000**

Cek di browser: http://localhost:3000/health — harus muncul JSON `{"status":"ok"}`.

### 6. Akses Frontend

Buka langsung di browser:

- **Admin:** http://localhost:3000/admin
- **Kasir:** http://localhost:3000/kasir
- **Order (pelanggan):** http://localhost:3000/order?table=1

**Akun demo:**

| Role  | Username | Password |
|-------|----------|----------|
| Admin | Admin    | admin    |
| Kasir | Kasir    | kasir    |

---

## Workflow Git

Jangan push langsung ke `main`. Semua perubahan masuk lewat Pull Request.

### Alur Kerja

```bash
# 1. Pastikan branch develop kamu up-to-date
git checkout develop
git pull origin develop

# 2. Buat branch baru
git checkout -b fix/nama-bug-kamu

# 3. Kerjakan perubahan, lalu commit
git add .
git commit -m "fix: deskripsi singkat perubahan"

# 4. Push ke remote
git push -u origin fix/nama-bug-kamu
```

Kemudian buat **Pull Request** ke branch `develop` di GitHub.

### Konvensi Penamaan Branch

| Tipe | Format | Contoh |
|------|--------|--------|
| Bug fix | `fix/nama-bug` | `fix/csp-inline-handler` |
| Fitur baru | `feature/nama-fitur` | `feature/payment-gateway` |
| UI / frontend | `ui/nama-halaman` | `ui/admin-sidebar` |
| Refactor | `refactor/nama-bagian` | `refactor/order-service` |

### Konvensi Pesan Commit

Gunakan format: `tipe: deskripsi singkat`

| Tipe | Kapan dipakai |
|------|--------------|
| `feat` | Fitur baru |
| `fix` | Bug fix |
| `style` | Perubahan CSS / tampilan |
| `refactor` | Refactor kode tanpa mengubah behavior |
| `docs` | Update dokumentasi |
| `chore` | Update dependency, config, dsb |

Contoh:
```
feat: tambah filter tanggal di laporan transaksi
fix: csp script-src-attr blok onclick sidebar admin
style: perbaiki layout sidebar mobile
docs: update README instalasi
```

---

## Struktur Project

```
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app, middleware, CSP
│   │   ├── server.js           # Entry point
│   │   ├── controllers/        # Handler per resource
│   │   ├── services/           # Business logic & query DB
│   │   ├── routes/             # Route definitions
│   │   ├── middleware/         # verifyToken, errorHandler
│   │   ├── validations/        # Joi / manual input validation
│   │   └── config/             # Koneksi database (pg Pool)
│   └── database/
│       ├── schema.postgres.sql
│       └── dummy_data.sql
└── frontend/
    └── public/
        ├── admin/index.html    # Dashboard admin (SPA)
        ├── kasir/index.html    # Dashboard kasir (SPA)
        ├── pages/              # order.html, login.html, about.html
        └── assets/
            ├── css/            # dashboard.css, kasir.css, dsb
            └── js/             # admin.js, kasir.js, api.config.js
```

---

## Troubleshooting

**`npm install` error / warning engine?**
Pastikan Node.js versi 20+:
```bash
node -v
```

**Backend error "cannot connect to database"?**
```bash
# Cek container Docker
docker compose ps
docker compose logs db

# Atau cek PostgreSQL lokal
psql -U postgres -c "\l"
```

**Port 5432 sudah dipakai?**
Edit `docker-compose.yml` ubah port ke `5433:5432`, lalu update `DATABASE_URL` di `.env`.

**Frontend tidak konek ke backend?**
Cek `frontend/public/assets/js/api.config.js` — pastikan URL backend sudah benar, atau pastikan meta tag `<meta name="api-url">` di HTML sudah sesuai.

**Login gagal / data kosong?**
```bash
psql -U postgres -d berkesan -h localhost -f backend/database/dummy_data.sql
```

**Menghentikan database Docker:**
```bash
docker compose down        # matikan, data tetap ada
docker compose down -v     # matikan + hapus semua data (reset total)
```
