## 🌿 Struktur Branch

```
main                    ← Kode FINAL yang sudah stabil
│
└── develop             ← Branch utama. Semua fitur di-merge kesini
    │
    ├── feature/fe-biolink          → Frontend : index.html bio instagram
    ├── feature/fe-website          → Frontend : website.html + menu.html
    ├── feature/fe-order            → Frontend : order.html + keranjang
    ├── feature/fe-reservasi        → Frontend : reservasi.html
    ├── feature/fe-admin            → Frontend : admin dashboard UI
    │
    ├── feature/be-config           → Backend : config, helper, struktur API
    ├── feature/be-order            → Backend : api/order + api/admin
    ├── feature/be-menu             → Backend : api/menu
    ├── feature/be-reservasi        → Backend : api/reservasi
    │
    ├── feature/db-schema           → Database: schema.sql + ERD
    ├── feature/db-dummy            → Database: dummy_data.sql
    │
    └── feature/docs-readme         → Dokumentasi: README + laporan
```

### Aturan Branch (WAJIB DIIKUTI SEMUA):

| Aturan | Penjelasan |
|--------|-----------|
| ❌ Dilarang push ke `main` | Main hanya di-merge |
| ❌ Dilarang push langsung ke `develop` | Semua harus lewat Pull Request |
| ✅ Selalu `git pull origin develop` sebelum mulai | Supaya kode selalu up-to-date |
| ✅ 1 branch = 1 fitur | Jangan campur-campur fitur dalam 1 branch |
| ✅ Commit message harus jelas | Format: `feat:`, `fix:`, `docs:`, `style:` |

---

## 📝 Format Commit Message

```bash
# Format: <type>: <deskripsi singkat>

feat: tambah halaman menu dengan filter kategori
fix: perbaiki bug cart tidak reset setelah order
style: rapikan padding navbar mobile
docs: update README cara install project
db: tambah dummy data untuk tabel menus
```

---

## 🔄 Alur Kerja Harian (Wajib Hafal)

```bash
# 1. Sebelum mulai kerja — selalu update dulu
git checkout develop
git pull origin develop

# 2. Pindah ke branch
git checkout feature/nama-branch-kamu
git merge develop          ← ambil update terbaru dari develop

# 3. Ngoding... ngoding... ngoding...

# 4. Setelah selesai
git add .
git commit -m "feat: deskripsi apa yang kamu buat"
git push origin feature/nama-branch-kamu

# 5. Buka GitHub → buat Pull Request ke develop
```
