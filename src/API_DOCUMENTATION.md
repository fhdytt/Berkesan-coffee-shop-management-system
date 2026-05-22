# API Documentation

Base URL: `http://localhost:3000/api`

Semua response menggunakan format JSON dengan struktur:
```json
{ "success": true/false, "data": {}, "message": "" }
```

---

## Auth

### POST `/auth/login`
Login dan mendapatkan JWT token.

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
Ambil semua menu yang tersedia (`is_available = true`).

### POST `/menu`
Tambah menu baru.

**Body:**
```json
{ "name": "Kopi Susu", "kategori_id": 1, "price": 18000, "stock": 50, "is_available": true, "image_url": null }
```

### PUT `/menu/:id`
Update menu berdasarkan ID. Body sama seperti POST.

### DELETE `/menu/:id`
Hapus menu. Jika menu sudah pernah masuk transaksi, menu akan dinonaktifkan (soft delete).

---

## Order

### GET `/order`
Ambil semua order. Query params opsional: `?status=pending&today=true`

### GET `/order/:id`
Detail order berdasarkan ID atau order code.

### POST `/order`
Buat order baru.

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

### PATCH `/order/:id/status`
Update status order.

**Body:**
```json
{ "status": "diproses", "paid_amount": 50000 }
```

Status yang valid: `pending` → `diproses` → `selesai` / `dibatalkan`

---

## Kasir

### GET `/kasir/orders`
Ambil semua order hari ini beserta item-nya.

### GET `/kasir/orders/lookup?code=ORD-xxx`
Cari order berdasarkan kode.

### GET `/kasir/orders/:id`
Detail order.

### PATCH `/kasir/orders/:id/status`
Update status order. Body: `{ "status": "selesai", "paid_amount": 50000 }`

### GET `/kasir/queue`
Antrian order dengan status `diproses` hari ini.

### GET `/kasir/history`
Riwayat order `selesai` dan `dibatalkan` hari ini.

---

## Dashboard

> Semua endpoint dashboard memerlukan JWT token di header:
> `Authorization: Bearer <token>`

### GET `/dashboard/stats`
Statistik hari ini: pendapatan, total order, produk terjual, produk terlaris, stok menipis, chart 7 hari.

### GET `/dashboard/rekap?month=05&year=2026`
Rekap bulanan: pendapatan harian, produk terlaris, ringkasan pembayaran.

### GET `/dashboard/stok`
Daftar semua menu beserta stok.

### GET `/dashboard/laporan?date=2026-05-20&status=selesai&payment=cash`
Laporan order dengan filter tanggal, status, dan metode pembayaran.

### GET `/dashboard/antrean`
Antrian order aktif dan 20 order selesai terakhir hari ini.

### GET `/dashboard/kategori`
Daftar semua kategori.

### POST `/dashboard/kategori`
Tambah kategori. Body: `{ "name": "Signature" }`

### GET `/dashboard/menu`
Semua menu (termasuk yang tidak aktif).

### POST `/dashboard/menu`
Tambah menu. Body sama seperti `POST /menu`.

### PUT `/dashboard/menu/:id`
Update menu.

### DELETE `/dashboard/menu/:id`
Hapus atau nonaktifkan menu.

### GET `/dashboard/meja`
Daftar semua meja.

### POST `/dashboard/meja`
Tambah meja. Body: `{ "table_number": "5" }`

### PATCH `/dashboard/meja/:id/toggle`
Aktifkan / nonaktifkan meja.

### DELETE `/dashboard/meja/:id`
Hapus meja. Jika sudah pernah dipakai order, meja dinonaktifkan.
