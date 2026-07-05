-- 1. Create tables (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'table_id') THEN
        ALTER TABLE orders ADD COLUMN table_id INTEGER REFERENCES tables(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. Insert default categories if they don't exist
INSERT INTO kategori (name)
SELECT 'Coffee'
WHERE NOT EXISTS (SELECT 1 FROM kategori WHERE LOWER(name) = LOWER('Coffee'));

INSERT INTO kategori (name)
SELECT 'Non Coffee'
WHERE NOT EXISTS (SELECT 1 FROM kategori WHERE LOWER(name) = LOWER('Non Coffee'));

INSERT INTO kategori (name)
SELECT 'Signature'
WHERE NOT EXISTS (SELECT 1 FROM kategori WHERE LOWER(name) = LOWER('Signature'));