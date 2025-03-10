// D:\biogas-app\server\routes\digesters.routes.js
const express = require('express');
const router = express.Router();
const db = require('../models');

// Получить все digesters
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM digesters';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Получить один digester по ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM digesters WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Digester not found' });
    res.json(results[0]);
  });
});

// Создать новый digester
router.post('/', (req, res) => {
  const {
    external_id,
    type,
    lat,
    lng,
    installation_date,
    installation_notes,
    total_digester_volume,
    digester_biogas_capacity,
    stove_rings_amount,
    external_reference,
    customer_id
  } = req.body;

  const sql = `
    INSERT INTO digesters (
      external_id, type, lat, lng, installation_date, installation_notes,
      total_digester_volume, digester_biogas_capacity, stove_rings_amount,
      external_reference, customer_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  db.query(sql, [
    external_id,
    type,
    lat,
    lng,
    installation_date,
    installation_notes,
    total_digester_volume,
    digester_biogas_capacity,
    stove_rings_amount,
    external_reference,
    customer_id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId });
  });
});

// Обновить digester
router.put('/:id', (req, res) => {
  const {
    external_id,
    type,
    lat,
    lng,
    installation_date,
    installation_notes,
    total_digester_volume,
    digester_biogas_capacity,
    stove_rings_amount,
    external_reference,
    customer_id
  } = req.body;

  const sql = `
    UPDATE digesters SET
      external_id = ?, type = ?, lat = ?, lng = ?, installation_date = ?,
      installation_notes = ?, total_digester_volume = ?, digester_biogas_capacity = ?,
      stove_rings_amount = ?, external_reference = ?, customer_id = ?, updated_at = NOW()
    WHERE id = ?
  `;
  db.query(sql, [
    external_id,
    type,
    lat,
    lng,
    installation_date,
    installation_notes,
    total_digester_volume,
    digester_biogas_capacity,
    stove_rings_amount,
    external_reference,
    customer_id,
    req.params.id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Digester not found' });
    res.json({ message: 'Digester updated' });
  });
});

// Удалить digester
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM digesters WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Digester not found' });
    res.json({ message: 'Digester deleted' });
  });
});

module.exports = router;
