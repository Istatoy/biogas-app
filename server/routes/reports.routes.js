// D:\biogas-app\server\routes\reports.routes.js
const express = require('express');
const router = express.Router();
const db = require('../models');

// Получить все отчёты (reports)
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM reports';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Получить отчет по ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM reports WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Report not found' });
    res.json(results[0]);
  });
});

// Создать новый отчет
router.post('/', (req, res) => {
  const {
    timestamp,
    static_pressure_pa,
    flow_lph,
    gas_consumption_l,
    battery_v,
    battery_a,
    solar_voltage,
    temperature_degc,
    temp_ext_degc,
    rssi_db,
    node_id
  } = req.body;

  const sql = `
    INSERT INTO reports (
      timestamp, static_pressure_pa, flow_lph, gas_consumption_l,
      battery_v, battery_a, solar_voltage, temperature_degc,
      temp_ext_degc, rssi_db, node_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  db.query(sql, [
    timestamp,
    static_pressure_pa,
    flow_lph,
    gas_consumption_l,
    battery_v,
    battery_a,
    solar_voltage,
    temperature_degc,
    temp_ext_degc,
    rssi_db,
    node_id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId });
  });
});

// Обновить отчет
router.put('/:id', (req, res) => {
  const {
    timestamp,
    static_pressure_pa,
    flow_lph,
    gas_consumption_l,
    battery_v,
    battery_a,
    solar_voltage,
    temperature_degc,
    temp_ext_degc,
    rssi_db,
    node_id
  } = req.body;

  const sql = `
    UPDATE reports SET
      timestamp = ?, static_pressure_pa = ?, flow_lph = ?, gas_consumption_l = ?,
      battery_v = ?, battery_a = ?, solar_voltage = ?, temperature_degc = ?,
      temp_ext_degc = ?, rssi_db = ?, node_id = ?, updated_at = NOW()
    WHERE id = ?
  `;
  db.query(sql, [
    timestamp,
    static_pressure_pa,
    flow_lph,
    gas_consumption_l,
    battery_v,
    battery_a,
    solar_voltage,
    temperature_degc,
    temp_ext_degc,
    rssi_db,
    node_id,
    req.params.id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report updated' });
  });
});

// Удалить отчет
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM reports WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report deleted' });
  });
});

module.exports = router;
