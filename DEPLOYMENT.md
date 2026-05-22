# Panduan Deployment — Kopi Berkesan

Panduan lengkap untuk menjalankan project **Kopi Berkesan** dari nol.

Arsitektur deployment:
- **Frontend** → Vercel (gratis, otomatis)
- **Backend** → Laptop/PC lokal, diekspos ke internet via **ngrok**
- **Database** → MySQL lokal

---

## Prasyarat

Pastikan sudah terinstall:

- [Node.js](https://nodejs.org) v18+
- [MySQL](https://dev.mysql.com/downloads/) v8+
- [ngrok](https://ngrok.com/download) (buat akun gratis)
- [Git](https://git-scm.com)
- Akun [Vercel](https://vercel.com) (gratis)
- Akun [GitHub](https://github.com)

---

## Bagian 1: Setup Database

### 1.1 Buat Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE berkesan;
EXIT;
```

### 1.2 Import Skema & Data

```bash
cd berkesan-backend

# Import struktur tabel
mysql -u root -p berkesan < database/schema.sql

# Import data awal (opsional)
mysql -u root -p berkesan < database/dummy_data.sql
```

### 1.3 Verifikasi

```bash
mysql -u root -p berkesan -e "SHOW TABLES;"
```

Output yang diharapkan:
```
+--------------------+
| Tables_in_berkesan |
+--------------------+
| kategori           |
| menu_items         |
| order_items        |
| orders             |
| tables             |
| users              |
+--------------------+
```

---

## Bagian 2: Setup Backend

### 2.1 Install Dependencies

```bash
cd berkesan-backend
npm install
```

### 2.2 Konfigurasi Environment

```bash
cp .env.example .env
```

Edit file `.env`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_mysql_kamu
DB_NAME=berkesan

JWT_SECRET=isi_dengan_string_acak_minimal_32_karakter

FRONTEND_URL=https://berkesan-coffe.vercel.app
```

> **Tips JWT_SECRET**: Generate string acak dengan:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 2.3 Jalankan Backend

```bash
npm start
```

Test apakah berjalan:
```bash
curl http://localhost:3000
# Response: {"status":"ok","message":"Berkesan API"}
```

---

## Bagian 3: Ekspos Backend dengan ngrok

### 3.1 Login ngrok

```bash
ngrok config add-authtoken TOKEN_KAMU
# Token ada di: https://dashboard.ngrok.com/get-started/your-authtoken
```

### 3.2 Jalankan ngrok

Buka terminal baru (biarkan backend tetap berjalan):

```bash
ngrok http 3000
```

Output ngrok akan menampilkan URL seperti:
```
Forwarding  https://xxxx-xxxx.ngrok-free.app -> http://localhost:3000
```

Salin URL `https://` tersebut — ini adalah **URL backend publik**.

### 3.3 Test URL ngrok

```bash
curl https://xxxx-xxxx.ngrok-free.app
# Response: {"status":"ok","message":"Berkesan API"}
```

---

## Bagian 4: Setup & Deploy Frontend

### 4.1 Update URL Backend

Edit file `berkesan-frontend/public/js/api.config.js`:

```js
const BACKEND_URL = "https://xxxx-xxxx.ngrok-free.app"; // URL ngrok dari langkah 3.2
```

### 4.2 Push ke GitHub

```bash
cd berkesan-frontend
git add public/js/api.config.js
git commit -m "update backend url"
git push
```

### 4.3 Deploy ke Vercel (Pertama Kali)

1. Buka [vercel.com](https://vercel.com) dan login
2. Klik **"Add New Project"**
3. Import repository `berkesan-frontend` dari GitHub
4. Konfigurasi:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (biarkan default)
   - **Build Command**: kosongkan
   - **Output Directory**: `.`
5. Klik **Deploy**

Setelah selesai, Vercel memberikan URL seperti `https://berkesan-coffe.vercel.app`.

---

## Alur Kerja Harian

Setiap kali ingin menjalankan aplikasi:

```
1. Jalankan MySQL (pastikan service aktif)
2. cd berkesan-backend && npm start
3. ngrok http 3000  (di terminal baru)
4. Salin URL ngrok baru
5. Update berkesan-frontend/public/js/api.config.js
6. git add . && git commit -m "update url" && git push
7. Tunggu Vercel redeploy (~30 detik)
8. Aplikasi siap digunakan
```

---

## Troubleshooting

### Backend tidak bisa konek ke database

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

Solusi: Pastikan MySQL service berjalan.
```bash
# Linux
sudo systemctl start mysql

# macOS
brew services start mysql
```

### CORS Error di browser

```
Access to fetch blocked by CORS policy
```

Solusi: Pastikan `FRONTEND_URL` di `.env` backend sudah benar dan sesuai dengan URL Vercel.

### ngrok: "ERR_NGROK_3200" atau tunnel expired

ngrok gratis memiliki batas waktu sesi. Jalankan ulang:
```bash
ngrok http 3000
```
Lalu update `api.config.js` dengan URL baru.

### Vercel tidak update setelah push

- Cek tab **Deployments** di dashboard Vercel
- Pastikan push berhasil ke branch yang benar (biasanya `main`)
- Trigger manual: klik **Redeploy** di dashboard Vercel

### 401 Unauthorized di semua request

Token JWT expired atau tidak valid. Logout dan login ulang di aplikasi.

---

## Struktur Repository

```
berkesan-backend/   → Backend Node.js (jalankan lokal + ngrok)
berkesan-frontend/  → Frontend static (deploy ke Vercel)
```

Kedua folder adalah repository Git terpisah.

---

## Catatan Penting

- URL ngrok **berubah setiap restart** (kecuali pakai ngrok berbayar dengan domain statis)
- Jangan commit file `.env` ke Git (sudah ada di `.gitignore`)
- Backend harus tetap berjalan selama aplikasi digunakan — jika laptop mati, aplikasi tidak bisa diakses
- Untuk production yang lebih stabil, pertimbangkan migrasi ke VPS atau Railway/Render
