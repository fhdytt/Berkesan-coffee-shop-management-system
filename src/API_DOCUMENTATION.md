# API Documentation — Berkesan

Base URL produksi: `https://<nama-project>.up.railway.app/api`
Base URL lokal: `http://localhost:3000/api`

Semua response menggunakan format:
```json
{ "success": true, "data": {} }
{ "success": false, "message": "pesan error" }
```

---

## Auth

### POST `/auth/login`
Login dan dapatkan JWT token.

**Body:**
```json
{ "username": "admin", "password": "password" }
```

**Response:**
```json
{
  "success": true,
  "token": "eyJ...",
  "user": { "id": 1, "username": "admin", "name": "Administrator", "role": "admin" }
}
```

---

## Menu

### GET `/menu`
Daftar menu aktif (`is_available = true`), diurutkan per kategori.

### POST `/menu`
Tambah menu baru.

**Body:**
```json
{ "name": "Kopi Susu", "kategori_id": 1, "price": 18000, "stock": 50, "is_available": true, "image_url": null }
```

### PUT `/menu/:id`
Update menu. Body sama seperti POST.

### DELETE `/menu/:id`
Hapus menu. Jika sudah pernah masuk transaksi → soft delete (`is_available = false`).

---

## Order

### GET `/order`
List order. Query params opsional: `?status=pending&today=true`

### GET `/order/:id`
Detail order berdasarkan ID atau order code.

### POST `/order`
Buat order baru. Menggunakan transaksi DB — stok dikurangi atomik.

**Body:**
```json
{
  "table_number": "1",
  "customer_name": "Budi",
  "payment_method": "cash",
  "notes": "",
  "items": [
    { "menu_item_id": 1, "quantity": 2 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": { "id": 42, "order_code": "ORD-260520-143022987", "total_price": 36000, "status": "pending" },
    "payment_code": "ORD-260520-143022987"
  }
}
```

### PATCH `/order/:id/status`
Update status order.

**Body:**
```json
{ "status": "diproses", "paid_amount": 50000 }
```

Status: `pending` → `diproses` → `selesai` / `dibatalkan`

---

## Kasir

### GET `/kasir/orders`
Semua order hari ini beserta item-nya.

### GET `/kasir/orders/lookup?code=ORD-xxx`
Cari order berdasarkan kode.

### GET `/kasir/orders/:id`
Detail order dan item-nya.

### PATCH `/kasir/orders/:id/status`
Update status order.

**Body:** `{ "status": "selesai", "paid_amount": 50000 }`

### GET `/kasir/queue`
Antrian order dengan status `diproses` hari ini.

### GET `/kasir/history`
Order `selesai` dan `dibatalkan` hari ini.

---

## Dashboard

> Endpoint `/dashboard/users` memerlukan header `Authorization: Bearer <token>`.  
> Endpoint lainnya di dashboard saat ini tidak wajib JWT (bisa disesuaikan).

### GET `/dashboard/stats`
Statistik hari ini: pendapatan, total order, produk terjual, 5 terlaris, 5 stok menipis, chart 7 hari.

### GET `/dashboard/rekap?month=05&year=2026`
Rekap bulanan: pendapatan harian, 5 produk terlaris, ringkasan metode pembayaran, perbandingan bulan lalu.

### GET `/dashboard/stok`
Semua menu dengan stok, bergabung dengan nama kategori.

### GET `/dashboard/laporan?date=2026-05-20&status=selesai&payment=cash`
Laporan order dengan filter tanggal, status, dan metode pembayaran. Maks 100 baris.

### GET `/dashboard/antrean`
Order `pending` dan `diproses` hari ini + 20 order `selesai` terakhir.

### GET `/dashboard/kategori`
Daftar semua kategori.

### POST `/dashboard/kategori`
Tambah kategori. **Body:** `{ "name": "Signature" }`

### GET `/dashboard/menu`
Semua menu termasuk yang tidak aktif.

### POST `/dashboard/menu`
Tambah menu (alias `POST /menu`).

### PUT `/dashboard/menu/:id`
Update menu (alias `PUT /menu/:id`).

### DELETE `/dashboard/menu/:id`
Hapus/nonaktifkan menu.

### GET `/dashboard/meja`
Daftar semua meja.

### POST `/dashboard/meja`
Tambah meja. **Body:** `{ "table_number": "5" }`

### PATCH `/dashboard/meja/:id/toggle`
Toggle aktif/nonaktif meja.

### DELETE `/dashboard/meja/:id`
Hapus meja. Jika sudah pernah dipakai order → soft delete (nonaktifkan).

### GET `/dashboard/users` *(Auth: JWT)*
Daftar semua user.

### POST `/dashboard/users` *(Auth: JWT, Admin only)*
Tambah user baru. **Body:** `{ "username": "kasir1", "password": "pass", "name": "Kasir Satu", "role": "kasir" }`

### DELETE `/dashboard/users/:id` *(Auth: JWT)*
Hapus user. Tidak bisa hapus akun sendiri.
