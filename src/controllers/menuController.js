const pool = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const [menus] = await pool.query(
      'SELECT * FROM menu_items WHERE is_available = true ORDER BY created_at DESC'
    );
    res.json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const [menus] = await pool.query(
      'SELECT * FROM menu_items WHERE id = ?',
      [id]
    );

    if (menus.length === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    res.json({ success: true, data: menus[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price required' });
    }

    const [result] = await pool.query(
      'INSERT INTO menu_items (name, price, description, category, is_available) VALUES (?, ?, ?, ?, true)',
      [name, price, description || null, category || 'Other']
    );

    res.status(201).json({
      success: true,
      message: 'Menu created',
      data: { id: result.insertId, name, price }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, is_available } = req.body;

    const [result] = await pool.query(
      'UPDATE menu_items SET name = ?, price = ?, description = ?, category = ?, is_available = ? WHERE id = ?',
      [name, price, description, category, is_available, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    res.json({ success: true, message: 'Menu updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      'DELETE FROM menu_items WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    res.json({ success: true, message: 'Menu deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};