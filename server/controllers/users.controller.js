// server\controllers\users.controller.js
const db = require('../models');
const bcrypt = require('bcrypt'); // для хеширования паролей (рекомендуется)

exports.getAllUsers = (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
};

exports.createUser = async (req, res) => {
  try {
    const {
      first_name, last_name, email, password, status, role_id, external_id
    } = req.body;

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (
        first_name, last_name, email, password, status, role_id, created_at, updated_at, external_id
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
    `;
    db.query(
      sql,
      [first_name, last_name, email, hashedPassword, status, role_id, external_id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    first_name, last_name, email, password, status, role_id, external_id
  } = req.body;

  try {
    // Если пароль передан, хешируем его, иначе оставляем без изменений
    let updatePasswordPart = '';
    const params = [first_name, last_name, email, status, role_id, external_id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatePasswordPart = 'password = ?,';
      params.splice(3, 0, hashedPassword); 
      // вставляем hashedPassword после email (зависит от порядка полей)
    }

    params.push(id);

    const sql = `
      UPDATE users
      SET
        first_name = ?, last_name = ?, email = ?,
        ${updatePasswordPart}
        status = ?, role_id = ?, external_id = ?, updated_at = NOW()
      WHERE id = ?
    `;
    db.query(sql, params, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User updated' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  });
};
