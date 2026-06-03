# Database — Berkesan

Database menggunakan **PostgreSQL** (di-host di Railway).

| File | Keterangan |
|------|------------|
| `schema.postgres.sql` | DDL utama — jalankan ini untuk inisialisasi |
| `schema.sql` | Schema MySQL lama (referensi saja, tidak dipakai) |
| `migration_pos_flow.sql` | Migrasi alur POS lama (referensi) |
| `dummy_data.sql` | Data awal minimal untuk testing |
| `dummy_data_test.sql` | Dataset lengkap untuk testing |
| `update_images.sql` | Script update URL gambar menu |

---

## Inisialisasi Database

```bash
psql $DATABASE_URL -f database/schema.postgres.sql
```

Atau via Railway CLI:

```bash
railway run psql $DATABASE_URL -f database/schema.postgres.sql
```

---

## Tabel

### `users`
Pengguna sistem (admin dan kasir).

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL PK | |
| username | VARCHAR(100) | Unik |
| password | VARCHAR(255) | Hash bcrypt |
| name | VARCHAR(150) | Nama lengkap |
| role | VARCHAR(10) | `admin`, `kasir`, `dev` |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### `kategori`
Kategori menu (contoh: Coffee, Non Coffee, Signature).

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL PK | |
| name | VARCHAR(100) | Unik |
| created_at | TIMESTAMPTZ | |

### `menu_items`
Item menu yang dijual.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL PK | |
| kategori_id | INTEGER FK | → `kategori.id` |
| name | VARCHAR(150) | |
| price | NUMERIC(10,2) | |
| image_url | TEXT | |
| stock | INTEGER | |
| is_available | BOOLEAN | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### `tables`
Data meja di kedai.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL PK | |
| table_number | VARCHAR(20) | Unik |
| qr_code | TEXT | |
| is_active | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

### `orders`
Transaksi order pelanggan.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL PK | |
| order_code | VARCHAR(50) | Unik, format `ORD-YYMMDD-HHMMSSxxx` |
| user_id | INTEGER FK | → `users.id` (nullable) |
| table_id | INTEGER FK | → `tables.id` (nullable) |
| customer_name | VARCHAR(150) | |
| total_price | NUMERIC(12,2) | |
| payment_method | VARCHAR(10) | `cash` atau `qris` |
| paid_amount | NUMERIC(12,2) | |
| change_amount | NUMERIC(12,2) | |
| status | VARCHAR(20) | `pending`, `diproses`, `selesai`, `dibatalkan` |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### `order_items`
Detail item dalam setiap order.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | SERIAL PK | |
| order_id | INTEGER FK | → `orders.id` (CASCADE delete) |
| menu_item_id | INTEGER FK | → `menu_items.id` (RESTRICT delete) |
| menu_name | VARCHAR(150) | Snapshot nama menu saat order |
| quantity | INTEGER | |
| price | NUMERIC(10,2) | Snapshot harga saat order |
| subtotal | NUMERIC(12,2) | Generated: `quantity × price` |

---

## Relasi

```
kategori 1──* menu_items 1──* order_items
                                   │
users 1──* orders *────────────────┘
tables 1──* orders
```

---

## Catatan

- `menu_name` dan `price` di `order_items` disimpan sebagai **snapshot** — data transaksi lama tetap akurat meski harga menu diubah.
- Menu tidak bisa dihapus jika sudah pernah masuk transaksi (RESTRICT). Sebagai gantinya di-soft delete (`is_available = false`).
- `order_items` otomatis terhapus jika order induknya dihapus (CASCADE).
