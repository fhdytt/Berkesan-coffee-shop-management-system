# Database — Berkesan

Database menggunakan **MySQL** dengan nama `berkesan`.

File skema: `schema.sql`
File migrasi: `migration_pos_flow.sql`
File data contoh: `dummy_data.sql`

---

## Tabel

### `users`
Menyimpan data pengguna sistem (admin dan kasir).

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT PK | Auto increment |
| username | VARCHAR(100) | Unik, untuk login |
| password | VARCHAR(255) | Hash bcrypt |
| name | VARCHAR(150) | Nama lengkap |
| role | ENUM | `admin`, `kasir`, `dev` |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | Auto update |

---

### `kategori`
Kategori menu (contoh: Coffee, Non Coffee, Signature).

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT PK | Auto increment |
| name | VARCHAR(100) | Unik |
| created_at | TIMESTAMP | |

---

### `menu_items`
Item menu yang dijual.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT PK | Auto increment |
| kategori_id | INT FK | Relasi ke `kategori.id` |
| name | VARCHAR(150) | Nama menu |
| price | DECIMAL(10,2) | Harga |
| image_url | LONGTEXT | URL atau base64 gambar |
| stock | INT | Stok tersedia |
| is_available | BOOLEAN | Tampil di menu atau tidak |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | Auto update |

---

### `tables`
Data meja di kedai.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT PK | Auto increment |
| table_number | VARCHAR(20) | Nomor meja, unik |
| qr_code | LONGTEXT | Data QR code meja |
| is_active | BOOLEAN | Meja aktif atau tidak |
| created_at | TIMESTAMP | |

---

### `orders`
Transaksi order pelanggan.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT PK | Auto increment |
| order_code | VARCHAR(50) | Kode unik order (contoh: `ORD-260520-...`) |
| user_id | INT FK | Relasi ke `users.id` (nullable) |
| table_id | INT FK | Relasi ke `tables.id` (nullable) |
| customer_name | VARCHAR(150) | Nama pelanggan |
| total_price | DECIMAL(12,2) | Total harga |
| payment_method | ENUM | `cash` atau `qris` |
| paid_amount | DECIMAL(12,2) | Jumlah dibayar |
| change_amount | DECIMAL(12,2) | Kembalian |
| status | ENUM | `pending`, `diproses`, `selesai`, `dibatalkan` |
| notes | TEXT | Catatan order |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | Auto update |

---

### `order_items`
Detail item dalam setiap order.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT PK | Auto increment |
| order_id | INT FK | Relasi ke `orders.id` (CASCADE delete) |
| menu_item_id | INT FK | Relasi ke `menu_items.id` |
| menu_name | VARCHAR(150) | Nama menu saat order (snapshot) |
| quantity | INT | Jumlah item |
| price | DECIMAL(10,2) | Harga satuan saat order (snapshot) |
| subtotal | DECIMAL(12,2) | `quantity × price` (generated column) |

---

## Relasi Antar Tabel

```
kategori
  └── menu_items (kategori_id → kategori.id)

users
  └── orders (user_id → users.id, SET NULL on delete)

tables
  └── orders (table_id → tables.id)

orders
  └── order_items (order_id → orders.id, CASCADE delete)

menu_items
  └── order_items (menu_item_id → menu_items.id, RESTRICT delete)
```

### Diagram ERD (teks)

```
┌──────────┐       ┌────────────┐       ┌─────────────┐
│ kategori │ 1───* │ menu_items │ 1───* │ order_items │
└──────────┘       └────────────┘       └─────────────┘
                                               │ *
                                               │
┌────────┐         ┌──────────┐ 1─────────────┘
│ users  │ 1───*   │  orders  │
└────────┘         └──────────┘
                        │ *
                        │
                   ┌──────────┐
                   │  tables  │
                   └──────────┘
```

---

## Catatan Penting

- `menu_name` dan `price` di `order_items` disimpan sebagai **snapshot** — artinya jika harga menu diubah di kemudian hari, data transaksi lama tetap akurat.
- `menu_items` tidak bisa dihapus jika sudah pernah masuk `order_items` (RESTRICT). Sebagai gantinya, menu akan di-soft delete (`is_available = false`).
- `order_items` otomatis terhapus jika order induknya dihapus (CASCADE).
