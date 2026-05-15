const pool = require('../config/database');

exports.create = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { user_id, items, total_price, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order items required' });
    }

    // Insert order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_price, status, notes) VALUES (?, ?, ?, ?)',
      [user_id, total_price || 0, 'pending', notes || null]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (let item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.menu_item_id, item.quantity, item.price]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Order created',
      data: { orderId, status: 'pending' }
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

exports.getAll = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.name, u.email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );

    // Get order items for each order
    for (let order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, m.name, m.price 
         FROM order_items oi 
         JOIN menu_items m ON oi.menu_item_id = m.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [items] = await pool.query(
      'SELECT oi.*, m.name FROM order_items oi JOIN menu_items m ON oi.menu_item_id = m.id WHERE oi.order_id = ?',
      [id]
    );

    res.json({ success: true, data: { ...orders[0], items } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
