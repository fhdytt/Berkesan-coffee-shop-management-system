# Berkesan ☕

Sistem Point of Sale (POS) berbasis web untuk kedai kopi. Dibangun dengan Node.js + Express di backend dan HTML/CSS/JS vanilla di frontend, dengan MySQL sebagai database.

---

## Fitur

- Halaman menu & order untuk pelanggan
- Panel kasir untuk memproses transaksi
- Dashboard admin untuk manajemen menu, meja, stok, dan laporan
- Autentikasi berbasis JWT
- Pembayaran cash & QRIS

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Node.js, Express |
| Database | MySQL |
| Auth | JWT, bcryptjs |
| Frontend | HTML, CSS, JavaScript (Vanilla) |

---

## Cara Install & Menjalankan

### Prasyarat
- Node.js v18+
- MySQL

### 1. Clone repository
```bash
git clone https://github.com/username/berkesan.git
cd berkesan
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup database
```bash
# Buat database dan tabel
mysql -u root -p < database/schema.sql
```

### 4. Konfigurasi environment
```bash
cp .env.example .env
```
Edit file `.env`:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_kamu
DB_NAME=berkesan
JWT_SECRET=isi_dengan_string_acak
```

### 5. Jalankan server
```bash
npm start
```

Buka browser ke `http://localhost:3000`

---

## Struktur Halaman

| URL | Keterangan |
|-----|------------|
| `/` | Halaman utama |
| `/order` | Halaman order pelanggan |
| `/about` | Tentang kami |
| `/login` | Login admin & kasir |
| `/kasir` | Panel kasir |
| `/admin` | Dashboard admin |

---

## Tim Pengembang

| Nama | Role |
|------|------|
| _(isi nama)_ | Fullstack / Project Lead |
| _(isi nama)_ | Frontend Developer |
| _(isi nama)_ | Backend Developer |
| _(isi nama)_ | Database & Dokumentasi |
