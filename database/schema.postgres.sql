-- ============================================================
-- Schema PostgreSQL untuk Berkesan
-- Jalankan sekali di database Railway PostgreSQL
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(100) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    name        VARCHAR(150),
    role        VARCHAR(10) NOT NULL DEFAULT 'kasir' CHECK (role IN ('admin', 'kasir', 'dev')),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kategori (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
    id              SERIAL PRIMARY KEY,
    kategori_id     INTEGER NOT NULL REFERENCES kategori(id),
    name            VARCHAR(150) NOT NULL,
    price           NUMERIC(10, 2) NOT NULL,
    image_url       TEXT,
    stock           INTEGER NOT NULL DEFAULT 0,
    is_available    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tables (
    id              SERIAL PRIMARY KEY,
    table_number    VARCHAR(20) UNIQUE NOT NULL,
    qr_code         TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id              SERIAL PRIMARY KEY,
    order_code      VARCHAR(50) UNIQUE NOT NULL,
    user_id         INTEGER DEFAULT NULL REFERENCES users(id) ON DELETE SET NULL,
    table_id        INTEGER DEFAULT NULL REFERENCES tables(id),
    customer_name   VARCHAR(150),
    total_price     NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_method  VARCHAR(10) NOT NULL CHECK (payment_method IN ('cash', 'qris')),
    paid_amount     NUMERIC(12, 2) DEFAULT 0,
    change_amount   NUMERIC(12, 2) DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'diproses', 'selesai', 'dibatalkan')),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id              SERIAL PRIMARY KEY,
    order_id        INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id    INTEGER NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
    menu_name       VARCHAR(150) NOT NULL,
    quantity        INTEGER NOT NULL DEFAULT 1,
    price           NUMERIC(10, 2) NOT NULL,
    subtotal        NUMERIC(12, 2) GENERATED ALWAYS AS (quantity * price) STORED
);

-- Index untuk performa query umum
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
