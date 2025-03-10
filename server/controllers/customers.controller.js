// server\controllers\customers.controller.js
const db = require('../models');

// Получить всех клиентов
exports.getAllCustomers = (req, res) => {
  const sql = 'SELECT * FROM customers';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Получить клиента по ID
exports.getCustomerById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM customers WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Customer not found' });
    res.json(results[0]);
  });
};

// Создать нового клиента
exports.createCustomer = (req, res) => {
  const {
    external_id, first_name, last_name, email, phone,
    contact_preference, system_status, gender, last_data_at, status
  } = req.body;

  const sql = `
    INSERT INTO customers (
      external_id, first_name, last_name, email, phone, contact_preference,
      system_status, gender, last_data_at, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(
    sql,
    [external_id, first_name, last_name, email, phone,
     contact_preference, system_status, gender, last_data_at, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    }
  );
};

// Обновить данные клиента
exports.updateCustomer = (req, res) => {
  const { id } = req.params;
  const {
    external_id, first_name, last_name, email, phone,
    contact_preference, system_status, gender, last_data_at, status
  } = req.body;

  const sql = `
    UPDATE customers
    SET
      external_id = ?, first_name = ?, last_name = ?, email = ?, phone = ?,
      contact_preference = ?, system_status = ?, gender = ?, last_data_at = ?,
      status = ?, updated_at = NOW()
    WHERE id = ?
  `;

  db.query(
    sql,
    [external_id, first_name, last_name, email, phone,
     contact_preference, system_status, gender, last_data_at, status, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json({ message: 'Customer updated' });
    }
  );
};

// Удалить клиента
exports.deleteCustomer = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM customers WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted' });
  });
};
