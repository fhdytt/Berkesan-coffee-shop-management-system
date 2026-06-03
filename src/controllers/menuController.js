const db = require("../config/database");

exports.getMenus = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        m.id, m.kategori_id, k.name AS kategori_name,
        m.name, m.price, m.image_url, m.stock, m.is_available,
        m.created_at, m.updated_at
      FROM menu_items m
      LEFT JOIN kategori k ON k.id = m.kategori_id
      WHERE m.is_available = TRUE
      ORDER BY k.name ASC, m.name ASC
    `);
    res.json({ success: true, data: { items: result.rows } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const { name, kategori_id, price, stock = 0, is_available = true, image_url = null } = req.body;
    if (!name || !kategori_id || price === undefined) {
      return res.status(400).json({ success: false, message: "Nama, kategori, dan harga wajib diisi" });
    }
    const result = await db.query(
      `INSERT INTO menu_items (kategori_id, name, price, stock, is_available, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [kategori_id, name, price, stock, !!is_available, image_url || null]
    );
    res.json({ success: true, message: "Menu berhasil dibuat", data: { id: result.rows[0].id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, kategori_id, price, stock = 0, is_available = true, image_url = null } = req.body;
    if (!name || !kategori_id || price === undefined) {
      return res.status(400).json({ success: false, message: "Nama, kategori, dan harga wajib diisi" });
    }
    await db.query(
      `UPDATE menu_items
       SET kategori_id=$1, name=$2, price=$3, stock=$4, is_available=$5, image_url=$6, updated_at=NOW()
       WHERE id=$7`,
      [kategori_id, name, price, stock, !!is_available, image_url || null, id]
    );
    res.json({ success: true, message: "Menu berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const usage = await db.query(
      "SELECT COUNT(*) AS total FROM order_items WHERE menu_item_id = $1",
      [req.params.id]
    );
    if (Number(usage.rows[0].total) > 0) {
      await db.query(
        "UPDATE menu_items SET is_available = FALSE, stock = 0, updated_at=NOW() WHERE id = $1",
        [req.params.id]
      );
      return res.json({ success: true, message: "Menu sudah pernah masuk transaksi, jadi dinonaktifkan" });
    }
    await db.query("DELETE FROM menu_items WHERE id = $1", [req.params.id]);
    res.json({ success: true, message: "Menu berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
