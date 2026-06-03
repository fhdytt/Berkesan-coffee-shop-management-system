const db = require("../config/database");

// GET /api/dashboard/rekap?month=05&year=2026
exports.getRekap = async (req, res) => {
  try {
    const { month, year } = req.query;
    const prevMonth = month == 1 ? 12 : month - 1;
    const prevYear = month == 1 ? year - 1 : year;

    const [summary, prevSummary, daily, bestProducts, paymentSummary] = await Promise.all([
      db.query(
        `SELECT COALESCE(SUM(total_price),0) AS "totalIncome", COUNT(*) AS "totalOrders",
                COALESCE((SELECT SUM(oi.quantity) FROM order_items oi JOIN orders o2 ON o2.id=oi.order_id
                  WHERE EXTRACT(MONTH FROM o2.created_at)=$1 AND EXTRACT(YEAR FROM o2.created_at)=$2 AND o2.status!='dibatalkan'),0) AS "totalSold"
         FROM orders WHERE EXTRACT(MONTH FROM created_at)=$1 AND EXTRACT(YEAR FROM created_at)=$2 AND status!='dibatalkan'`,
        [month, year]
      ),
      db.query(
        `SELECT COALESCE(SUM(total_price),0) AS "prevIncome", COUNT(*) AS "prevOrders"
         FROM orders WHERE EXTRACT(MONTH FROM created_at)=$1 AND EXTRACT(YEAR FROM created_at)=$2 AND status!='dibatalkan'`,
        [prevMonth, prevYear]
      ),
      db.query(
        `SELECT created_at::date AS tanggal, SUM(total_price) AS total
         FROM orders WHERE EXTRACT(MONTH FROM created_at)=$1 AND EXTRACT(YEAR FROM created_at)=$2 AND status!='dibatalkan'
         GROUP BY created_at::date ORDER BY tanggal ASC`,
        [month, year]
      ),
      db.query(
        `SELECT menu_name, SUM(quantity) AS sold, SUM(subtotal) AS revenue
         FROM order_items oi JOIN orders o ON o.id=oi.order_id
         WHERE EXTRACT(MONTH FROM o.created_at)=$1 AND EXTRACT(YEAR FROM o.created_at)=$2 AND o.status!='dibatalkan'
         GROUP BY menu_name ORDER BY revenue DESC LIMIT 5`,
        [month, year]
      ),
      db.query(
        `SELECT payment_method, COUNT(*) AS total_orders, SUM(total_price) AS total_income
         FROM orders WHERE EXTRACT(MONTH FROM created_at)=$1 AND EXTRACT(YEAR FROM created_at)=$2 AND status!='dibatalkan'
         GROUP BY payment_method`,
        [month, year]
      ),
    ]);

    res.json({
      success: true,
      data: {
        daily: daily.rows,
        bestProducts: bestProducts.rows,
        paymentSummary: paymentSummary.rows,
        ...summary.rows[0],
        ...prevSummary.rows[0],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/dashboard/stok
exports.getStok = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT m.*, k.name AS kategori_name FROM menu_items m JOIN kategori k ON k.id=m.kategori_id ORDER BY m.stock ASC`
    );
    res.json({ success: true, data: { items: result.rows } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getKategori = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM kategori ORDER BY name ASC`);
    res.json({ success: true, data: { items: result.rows } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createKategori = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Nama kategori wajib diisi" });
    const result = await db.query(`INSERT INTO kategori (name) VALUES ($1) RETURNING id`, [name]);
    res.json({ success: true, data: { id: result.rows[0].id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMenu = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT m.*, k.name AS kategori_name
      FROM menu_items m
      LEFT JOIN kategori k ON k.id = m.kategori_id
      ORDER BY m.created_at DESC
    `);
    res.json({ success: true, data: { items: result.rows } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const menuController = require("./menuController");
exports.createMenu = menuController.createMenu;
exports.updateMenu = menuController.updateMenu;
exports.deleteMenu = menuController.deleteMenu;

exports.getMeja = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM tables ORDER BY table_number::integer NULLS LAST, table_number`
    );
    res.json({ success: true, data: { tables: result.rows } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createMeja = async (req, res) => {
  try {
    const { table_number, qr_code = null } = req.body;
    if (!table_number) return res.status(400).json({ success: false, message: "Nomor meja wajib diisi" });
    const result = await db.query(
      `INSERT INTO tables (table_number, qr_code, is_active) VALUES ($1, $2, TRUE) RETURNING id`,
      [table_number, qr_code]
    );
    res.json({ success: true, data: { id: result.rows[0].id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleMeja = async (req, res) => {
  try {
    await db.query(`UPDATE tables SET is_active = NOT is_active WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteMeja = async (req, res) => {
  try {
    const usage = await db.query(
      `SELECT COUNT(*) AS total FROM orders WHERE table_id = $1`,
      [req.params.id]
    );
    if (Number(usage.rows[0].total) > 0) {
      await db.query(`UPDATE tables SET is_active = FALSE WHERE id = $1`, [req.params.id]);
      return res.json({
        success: true,
        data: { softDeleted: true },
        message: "Meja sudah pernah dipakai order, jadi dinonaktifkan agar riwayat tetap aman.",
      });
    }
    await db.query(`DELETE FROM tables WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: "Meja berhasil dihapus." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/dashboard/laporan?date=&status=&payment=
exports.getLaporan = async (req, res) => {
  try {
    const { date, status, payment } = req.query;
    let sql = `SELECT * FROM orders WHERE 1=1`;
    const params = [];
    let idx = 1;
    if (date)    { sql += ` AND created_at::date=$${idx++}`;   params.push(date); }
    if (status)  { sql += ` AND status=$${idx++}`;             params.push(status); }
    if (payment) { sql += ` AND payment_method=$${idx++}`;     params.push(payment); }
    sql += ` ORDER BY created_at DESC LIMIT 100`;
    const result = await db.query(sql, params);
    res.json({ success: true, data: { orders: result.rows } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/dashboard/antrean
exports.getAntrean = async (req, res) => {
  try {
    const orders = await db.query(
      `SELECT * FROM orders WHERE created_at::date=CURRENT_DATE AND status IN ('pending','diproses') ORDER BY created_at ASC`
    );
    const selesai = await db.query(
      `SELECT * FROM orders WHERE created_at::date=CURRENT_DATE AND status='selesai' ORDER BY updated_at DESC LIMIT 20`
    );
    res.json({ success: true, data: { orders: orders.rows, selesai: selesai.rows } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [summary, bestProducts, lowStock, recentOrders, salesChart] = await Promise.all([
      db.query(`
        SELECT
          COALESCE(SUM(CASE WHEN created_at::date=CURRENT_DATE AND status!='dibatalkan' THEN total_price END),0) AS "incomeToday",
          COUNT(CASE WHEN created_at::date=CURRENT_DATE THEN 1 END) AS "ordersToday",
          COALESCE((SELECT SUM(oi.quantity) FROM order_items oi JOIN orders o2 ON o2.id=oi.order_id
            WHERE o2.created_at::date=CURRENT_DATE AND o2.status!='dibatalkan'),0) AS "productsSold"
        FROM orders
      `),
      db.query(
        `SELECT menu_name, SUM(quantity) AS sold, SUM(subtotal) AS revenue FROM order_items GROUP BY menu_name ORDER BY sold DESC LIMIT 5`
      ),
      db.query(
        `SELECT name, stock FROM menu_items WHERE stock <= 10 ORDER BY stock ASC LIMIT 5`
      ),
      db.query(
        `SELECT order_code, customer_name, total_price, payment_method, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5`
      ),
      db.query(
        `SELECT created_at::date AS tanggal, SUM(total_price) AS total
         FROM orders
         WHERE created_at >= CURRENT_DATE - INTERVAL '6 days' AND status!='dibatalkan'
         GROUP BY created_at::date ORDER BY tanggal ASC`
      ),
    ]);

    res.json({
      success: true,
      data: {
        ...summary.rows[0],
        bestProducts: bestProducts.rows,
        lowStock: lowStock.rows,
        recentOrders: recentOrders.rows,
        salesChart: salesChart.rows,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
