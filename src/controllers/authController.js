const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, password, name, role = "kasir" } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Username dan password wajib diisi" });
    }
    if (!["kasir", "admin"].includes(role)) {
      return res.status(400).json({ success: false, error: "Role tidak valid" });
    }
    const existing = await db.query("SELECT id FROM users WHERE username = $1 LIMIT 1", [username]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: "Username sudah digunakan" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (username, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id",
      [username, hashed, name || username, role]
    );
    return res.json({ success: true, data: { id: result.rows[0].id } });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, username, name, role, created_at FROM users ORDER BY created_at DESC"
    );
    return res.json({ success: true, data: { users: result.rows } });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id == id) {
      return res.status(400).json({ success: false, error: "Tidak bisa hapus akun sendiri" });
    }
    await db.query("DELETE FROM users WHERE id = $1", [id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Username dan password wajib diisi" });
    }

    const result = await db.query("SELECT * FROM users WHERE username = $1 LIMIT 1", [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: "Username tidak ditemukan" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
