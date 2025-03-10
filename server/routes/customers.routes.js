// D:\biogas-app\server\routes\customers.routes.js
const express = require('express');
const router = express.Router();
const db = require('../models'); // Пул соединений из models/index.js

// Получить всех клиентов
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM customers';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Получить клиента по ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM customers WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Customer not found' });
    res.json(results[0]);
  });
});

// Создать нового клиента
router.post('/', (req, res) => {
  const {
    external_id,
    first_name,
    last_name,
    email,
    phone,
    contact_preference,
    system_status,
    gender,
    last_data_at,
    status
  } = req.body;

  const sql = `
    INSERT INTO customers (
      external_id, first_name, last_name, email, phone, contact_preference,
      system_status, gender, last_data_at, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  db.query(sql, [
    external_id,
    first_name,
    last_name,
    email,
    phone,
    contact_preference,
    system_status,
    gender,
    last_data_at,
    status
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId });
  });
});

// Обновить клиента
router.put('/:id', (req, res) => {
  const {
    external_id,
    first_name,
    last_name,
    email,
    phone,
    contact_preference,
    system_status,
    gender,
    last_data_at,
    status
  } = req.body;

  const sql = `
    UPDATE customers SET
      external_id = ?, first_name = ?, last_name = ?, email = ?, phone = ?,
      contact_preference = ?, system_status = ?, gender = ?, last_data_at = ?,
      status = ?, updated_at = NOW()
    WHERE id = ?
  `;
  db.query(sql, [
    external_id,
    first_name,
    last_name,
    email,
    phone,
    contact_preference,
    system_status,
    gender,
    last_data_at,
    status,
    req.params.id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer updated' });
  });
});

// Удалить клиента
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM customers WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  });
});

module.exports = router;
