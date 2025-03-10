// D:\biogas-app\server\routes\nodes.routes.js
const express = require('express');
const router = express.Router();
const db = require('../models');

// Получить все nodes
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM nodes';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Получить node по ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM nodes WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Node not found' });
    res.json(results[0]);
  });
});

// Создать новый node
router.post('/', (req, res) => {
  const { external_id, installation_date, digester_id } = req.body;
  const sql = `
    INSERT INTO nodes (
      external_id, installation_date, digester_id, created_at, updated_at
    ) VALUES (?, ?, ?, NOW(), NOW())
  `;
  db.query(sql, [external_id, installation_date, digester_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId });
  });
});

// Обновить node
router.put('/:id', (req, res) => {
  const { external_id, installation_date, digester_id } = req.body;
  const sql = `
    UPDATE nodes SET
      external_id = ?, installation_date = ?, digester_id = ?, updated_at = NOW()
    WHERE id = ?
  `;
  db.query(sql, [external_id, installation_date, digester_id, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Node not found' });
    res.json({ message: 'Node updated' });
  });
});

// Удалить node
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM nodes WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Node not found' });
    res.json({ message: 'Node deleted' });
  });
});

module.exports = router;
