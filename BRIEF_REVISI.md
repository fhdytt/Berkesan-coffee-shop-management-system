# Brief Revisi — Berkesan POS
**Versi:** 2.0  
**Tanggal:** 4 Juli 2026  
**Project:** Berkesan Coffee Shop — Point of Sale & Ordering System  
**Stack:** Express.js · PostgreSQL · Tailwind CSS (Vanilla JS)  
**Tujuan saat ini:** Integrasi Payment Gateway (Midtrans / Xendit)

---

## Kondisi Project Saat Ini

Project sudah berjalan dengan fitur inti yang stabil:
- ✅ Auth (JWT, role admin/kasir)
- ✅ CRUD Menu & Kategori
- ✅ CRUD Meja dengan QR code
- ✅ Alur Order → Pembayaran → Antrian → Selesai
- ✅ Nomor antrian otomatis dari database (`queue_number`)
- ✅ Dashboard statistik & laporan
- ✅ Cetak struk
- ✅ Schema database sudah *payment gateway ready* (tabel `payment_transactions`, `payment_webhook_logs`, kolom `gateway_reference_id`, `payment_url`, `payment_status`, dll.)
- ✅ Fitur stok & bahan baku sudah dihapus (tidak digunakan)
- ✅ Dependencies cross-platform — bisa jalan di Windows & Linux

**Yang belum ada:** Implementasi payment gateway di backend maupun frontend.

---

## Gap Analysis — Menuju Payment Gateway

### BACKEND

---

#### B1. Tidak Ada Route & Controller Payment Gateway

**Status:** ❌ Belum dibuat  
**Lokasi yang perlu dibuat:**
- `backend/src/controllers/paymentController.js`
- `backend/src/routes/paymentRoutes.js`

**Yang perlu diimplementasi:**

```
POST  /api/payment/:orderId/create    → Buat transaksi ke gateway, simpan payment_url
GET   /api/payment/:orderId/status    → Cek status pembayaran (untuk polling frontend)
POST  /api/payment/webhook/midtrans   → Terima callback Midtrans (PUBLIC - tanpa auth)
POST  /api/payment/webhook/xendit     → Terima callback Xendit   (PUBLIC - tanpa auth)
```

> Route webhook **wajib public** (tanpa `verifyToken`) karena gateway tidak punya token kita. Keamanan dijamin via verifikasi HMAC signature.

---

#### B2. Tidak Ada Service Layer untuk Gateway

**Status:** ❌ Belum dibuat  
**Lokasi:** `backend/src/services/paymentService.js` (file ada tapi kosong — 0 bytes)

Service ini akan menjadi abstraksi agar controller tidak bergantung langsung ke satu gateway. Fungsi yang perlu dibuat:

```js
createTransaction(gateway, orderData)         // Panggil API gateway, kembalikan payment_url
verifyWebhookSignature(gateway, payload, req) // Verifikasi HMAC per gateway
updatePaymentStatus(orderId, status, txData)  // Update orders + payment_transactions
```

Dengan abstraksi ini, ganti dari Midtrans ke Xendit (atau sebaliknya) cukup di satu file.

---

#### B3. Tidak Ada Middleware Verifikasi Webhook

**Status:** ❌ Belum dibuat  
**Lokasi:** `backend/src/middleware/validateWebhookSignature.js`

Setiap callback dari gateway harus diverifikasi signature-nya sebelum diproses. Tanpa ini, endpoint webhook bisa dieksploitasi oleh pihak luar untuk memalsukan konfirmasi pembayaran.

- **Midtrans:** verifikasi dengan `SHA512(orderId + statusCode + grossAmount + serverKey)`
- **Xendit:** verifikasi dengan `x-callback-token` header dibandingkan `XENDIT_WEBHOOK_TOKEN` dari env

---

#### B4. `app.js` Belum Mendaftarkan Route Payment

**Status:** ❌ Belum ditambahkan  
**Lokasi:** `backend/src/app.js` baris route

Setelah `paymentRoutes.js` dibuat, perlu didaftarkan:

```js
const paymentRouter = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRouter);
```

> **Penting:** Rate limiter general (60 req/menit) tidak boleh diaplikasikan ke route webhook karena gateway bisa mengirim callback dalam jumlah banyak dalam waktu singkat. Kecualikan `/api/payment/webhook/*` dari rate limiter.

---

#### B5. Variabel Environment Payment Gateway Belum Lengkap

**Status:** ⚠️ Placeholder ada, belum diisi  
**Lokasi:** `backend/.env.example`

Sudah ada placeholder untuk Midtrans dan Xendit, tapi belum ada variabel:
- `PAYMENT_WEBHOOK_BASE_URL` — URL publik server untuk menerima callback (wajib diisi, tidak bisa `localhost`)
- `PAYMENT_TIMEOUT_MINUTES` — durasi sebelum link pembayaran expired (default 60 menit)

---

#### B6. Filter Laporan Tidak Konsisten dengan Schema Baru

**Status:** ⚠️ Perlu diperbaiki  
**Lokasi:** `backend/src/controllers/dashboardController.js`

Query statistik pendapatan masih menggunakan `status != 'dibatalkan'` sebagai filter, padahal schema baru memisahkan status pesanan (`status`) dari status bayar (`payment_status`). Dengan arsitektur gateway, order bisa berstatus `diproses` tapi belum tentu `payment_status = 'paid'` (misalnya customer pilih VA tapi belum transfer).

**Yang perlu diubah:**
- `getRekap` — ganti `status != 'dibatalkan'` → `payment_status = 'paid'`
- `getDashboardStats` — ganti filter yang sama di query `incomeToday` dan `totalSold`

Gunakan view `daily_sales` yang sudah ada di schema untuk menyederhanakan query ini.

---

### FRONTEND

---

#### F1. Modal Pembayaran Kasir Hanya Ada Cash & QRIS

**Status:** ❌ Perlu diperluas  
**Lokasi:** `frontend/public/assets/js/kasir.js` — fungsi `openPaymentModal()`

Tombol metode pembayaran hardcode hanya dua:
```js
<button data-method="cash">Cash</button>
<button data-method="qris">QRIS</button>
```

Schema dan backend sudah mendukung: `cash, qris, transfer, debit, credit, va, ewallet`. Kasir tidak bisa mencatat pembayaran Debit atau Transfer saat ini.

**Yang perlu ditambahkan:** Tombol Debit dan Transfer minimal. Untuk VA dan e-wallet, bisa kondisional (hanya tampil jika gateway aktif via config).

---

#### F2. Fungsi `payIcon()` Hanya Kenal Cash & QRIS

**Status:** ❌ Perlu diperluas  
**Lokasi:** `frontend/public/assets/js/kasir.js` baris 148

```js
function payIcon(method) {
  return method === 'cash'
    ? '... Cash'
    : '... QRIS';  // semua selain cash → ikon QRIS
}
```

Order dengan `payment_method = 'transfer'`, `'debit'`, atau `'va'` akan tampil sebagai ikon QRIS di kartu order, tabel riwayat, dan tampilan antrian. Sangat menyesatkan kasir.

**Yang perlu dibuat:**
```js
function payIcon(method) {
  const map = {
    cash:     { icon: 'money-bill-wave',  label: 'Cash'     },
    qris:     { icon: 'qrcode',           label: 'QRIS'     },
    debit:    { icon: 'credit-card',      label: 'Debit'    },
    transfer: { icon: 'building-columns', label: 'Transfer' },
    va:       { icon: 'building-columns', label: 'VA'       },
    ewallet:  { icon: 'wallet',           label: 'E-Wallet' },
    credit:   { icon: 'credit-card',      label: 'Credit'   },
  };
  const m = map[method] || { icon: 'circle-question', label: method || '—' };
  return `<i class="fa-solid fa-${m.icon}"></i> ${m.label}`;
}
```

---

#### F3. Tabel Riwayat Tidak Menampilkan `payment_status`

**Status:** ❌ Belum ada  
**Lokasi:** `frontend/public/assets/js/kasir.js` — fungsi `renderRiwayat()`

Kolom tabel riwayat saat ini: `Order Code | Customer | Item | Total | Metode | Status | Waktu | Aksi`

Tidak ada kolom `payment_status`. Dengan gateway aktif nanti, kasir perlu tahu apakah pembayaran sudah `paid` atau masih `pending` (misalnya customer pilih VA tapi belum transfer). Tanpa ini kasir tidak bisa membedakan order yang benar-benar lunas.

**Yang perlu ditambahkan:** Badge `payment_status` di kolom sendiri atau di samping kolom `Status` — hijau untuk `paid`, kuning untuk `pending`, merah untuk `failed/unpaid`.

---

#### F4. Auto-refresh 30 Detik — Terlalu Lambat untuk Gateway

**Status:** ⚠️ Perlu dipercepat  
**Lokasi:** `frontend/public/assets/js/kasir.js` baris paling bawah

```js
_autoRefresh = setInterval(() => {
  if (_currentSection === 'pesanan') loadOrders();
  if (_currentSection === 'antrian') loadAntrian();
}, 30000); // 30 detik
```

Saat payment gateway aktif, konfirmasi pembayaran (webhook) bisa masuk kapan saja. Dengan interval 30 detik, kasir harus menunggu hampir setengah menit sebelum status order berubah. Ini membuat pengalaman kasir buruk.

**Solusi jangka pendek:** Ubah interval ke `10000` (10 detik).  
**Solusi jangka panjang:** Implementasi SSE (Server-Sent Events) — server push notifikasi ke browser saat webhook masuk, tanpa perlu polling.

---

#### F5. Duplikasi Fungsi `printReceiptDirect`

**Status:** ❌ Bug — Perlu segera diperbaiki  
**Lokasi:** `frontend/public/assets/js/kasir.js` baris 734 dan 770

Fungsi `printReceiptDirect` didefinisikan **dua kali**. Definisi pertama (baris 734) menggunakan `fetch` langsung. Definisi kedua (baris 770) menggunakan `apiFetch` (helper yang sudah ada).

Definisi kedua menimpa yang pertama — tapi keberadaan dua definisi adalah tanda kode belum dibersihkan dan bisa menyebabkan kebingungan saat debugging.

**Yang perlu dilakukan:** Hapus definisi pertama (baris 734) yang menggunakan `fetch` langsung. Pertahankan definisi kedua yang menggunakan `apiFetch`.

---

#### F6. Halaman Order Customer — QRIS Hanya Mode Statis

**Status:** ⚠️ Perlu dipersiapkan  
**Lokasi:** `frontend/public/assets/js/order.js` — fungsi `openQrisModal()`

Saat ini QRIS hanya menampilkan gambar QR statis milik owner. Customer harus input nominal sendiri saat scan. Tidak ada verifikasi otomatis pembayaran.

Untuk mode manual (tanpa gateway) ini masih acceptable — kasir yang konfirmasi. Tapi saat gateway aktif, flow harus berubah total:
1. Order dibuat → backend panggil gateway → dapat `payment_url` / QR dinamis
2. QR unik per transaksi ditampilkan ke customer
3. Frontend polling `/api/payment/:orderId/status` sampai `payment_status = 'paid'`
4. Setelah paid → tampilkan halaman sukses + nomor antrian

**Yang perlu disiapkan sekarang:**
- Pisahkan modal QRIS menjadi dua mode: `manual` dan `gateway`
- Mode dikendalikan oleh flag di `api.config.js` (misal `window.PAYMENT_MODE = 'manual'`)
- Saat mode `gateway`: tampilkan QR dari `payment_url`, lakukan polling status

---

#### F7. Halaman Order Customer — Pilihan Metode Pembayaran Terbatas

**Status:** ⚠️ Perlu ditambah  
**Lokasi:** `frontend/public/assets/js/order.js` — fungsi `submitOrder()` dan UI checkout

`selectedPayment` defaultnya `"qris"`, pilihan di UI hanya QRIS dan Cash. Debit belum ada sebagai opsi untuk customer.

---

### DATABASE / SCHEMA

---

#### D1. Tidak Ada Data Default untuk `payment_transactions`

**Status:** ℹ️ Informasi  

Tabel `payment_transactions` dan `payment_webhook_logs` sudah ada di schema. Tidak perlu migration tambahan untuk memulai integrasi gateway.

---

#### D2. `dummy_data.sql` Tidak Mencakup Data `payment_status`

**Status:** ⚠️ Minor  
**Lokasi:** `backend/database/dummy_data.sql`

Data dummy order yang sudah ada menggunakan `status` lama tanpa mengisi `payment_status` secara eksplisit. Ini tidak masalah karena default schema sudah `payment_status = 'unpaid'`, tapi laporan yang filter `payment_status = 'paid'` akan menampilkan 0 data saat testing dengan data dummy.

**Yang perlu dilakukan:** Update `dummy_data.sql` agar beberapa order dummy memiliki `payment_status = 'paid'` dan `paid_at` terisi, supaya dashboard dan laporan bisa ditest dengan data yang realistis.

---

## Urutan Pengerjaan yang Disarankan

```
Tahap 1 — Perbaikan Cepat (bisa dikerjakan paralel)
├── F2: Perluas fungsi payIcon() untuk semua metode
├── F3: Tambah kolom payment_status di tabel riwayat kasir
├── F4: Ubah auto-refresh dari 30s → 10s
├── F5: Hapus duplikasi printReceiptDirect
└── B6: Perbaiki filter laporan ke payment_status = 'paid'

Tahap 2 — Fondasi Gateway (sebelum integrasi API)
├── B2: Buat paymentService.js (abstraksi layer, stub dulu)
├── B3: Buat validateWebhookSignature.js middleware
├── B1: Buat paymentController.js + paymentRoutes.js
├── B4: Daftarkan ke app.js + exclude dari rate limiter
└── B5: Tambah variabel env yang kurang di .env.example

Tahap 3 — Frontend Siap Gateway
├── F1: Tambah tombol Debit & Transfer di modal bayar kasir
├── F6: Pisahkan modal QRIS manual vs gateway di order page
├── F7: Tambah opsi Debit di checkout customer
└── D2: Update dummy_data.sql agar ada order dengan payment_status = 'paid'

Tahap 4 — Integrasi Gateway (setelah diskusi gateway & credentials)
├── Pilih gateway: Midtrans atau Xendit
├── Implement createTransaction → panggil API gateway
├── Implement webhook handler + verifikasi signature
├── Implement polling status di frontend
└── End-to-end test di sandbox
```

---

## Konfirmasi yang Dibutuhkan dari Owner Sebelum Tahap 4

| # | Pertanyaan | Dampak |
|---|---|---|
| 1 | **Gateway mana?** Midtrans atau Xendit? | Implementasi `paymentService.js` berbeda untuk masing-masing |
| 2 | **Metode apa yang diaktifkan?** QRIS saja? Atau VA dan e-wallet juga? | Menentukan tombol apa yang tampil di UI customer & kasir |
| 3 | **Apakah customer bisa bayar sendiri** (self-service via QR), atau kasir yang selalu konfirmasi? | Menentukan apakah frontend order page perlu polling status |
| 4 | **URL publik server** sudah ada? | Webhook dari gateway tidak bisa dikirim ke `localhost` — butuh URL publik atau tunnel (ngrok/Cloudflare) untuk testing |

---

## Ringkasan File yang Perlu Dibuat / Dimodifikasi

### Dibuat Baru
| File | Keterangan |
|---|---|
| `backend/src/controllers/paymentController.js` | Handler create transaksi, webhook, cek status |
| `backend/src/routes/paymentRoutes.js` | Route `/api/payment/...` |
| `backend/src/services/paymentService.js` | Abstraksi Midtrans / Xendit (file kosong sudah ada) |
| `backend/src/middleware/validateWebhookSignature.js` | Verifikasi HMAC signature webhook |

### Dimodifikasi
| File | Yang Diubah |
|---|---|
| `backend/src/app.js` | Tambah route payment, exclude webhook dari rate limiter |
| `backend/src/controllers/dashboardController.js` | Ganti filter `status` → `payment_status = 'paid'` |
| `backend/.env.example` | Tambah `PAYMENT_WEBHOOK_BASE_URL`, `PAYMENT_TIMEOUT_MINUTES` |
| `frontend/public/assets/js/kasir.js` | Perluas `payIcon()`, tambah `payment_status` di riwayat, percepat auto-refresh, hapus duplikasi `printReceiptDirect`, tambah tombol Debit/Transfer di modal bayar |
| `frontend/public/assets/js/order.js` | Siapkan dua mode QRIS, tambah opsi Debit |
| `frontend/public/assets/js/api.config.js` | Tambah flag `PAYMENT_MODE` |
| `backend/database/dummy_data.sql` | Update beberapa order dummy dengan `payment_status = 'paid'` |

---

*Dokumen ini mencerminkan kondisi kode aktual per 4 Juli 2026. Diperbarui setelah audit menyeluruh seluruh controller, routes, dan frontend JS.*
