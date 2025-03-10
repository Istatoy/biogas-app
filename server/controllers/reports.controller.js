// server\controllers\reports.controller.js
const db = require('../models');

exports.getAllReports = (req, res) => {
  const sql = 'SELECT * FROM reports';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getReportById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM reports WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Report not found' });
    res.json(results[0]);
  });
};

exports.createReport = (req, res) => {
  const {
    timestamp, static_pressure_pa, flow_lph, gas_consumption_l,
    battery_v, battery_a, solar_voltage, temperature_degc, temp_ext_degc, rssi_db,
    node_id
  } = req.body;

  const sql = `
    INSERT INTO reports (
      timestamp, static_pressure_pa, flow_lph, gas_consumption_l,
      battery_v, battery_a, solar_voltage, temperature_degc, temp_ext_degc, rssi_db,
      node_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  db.query(
    sql,
    [
      timestamp, static_pressure_pa, flow_lph, gas_consumption_l,
      battery_v, battery_a, solar_voltage, temperature_degc, temp_ext_degc, rssi_db,
      node_id
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    }
  );
};

exports.updateReport = (req, res) => {
  const { id } = req.params;
  const {
    timestamp, static_pressure_pa, flow_lph, gas_consumption_l,
    battery_v, battery_a, solar_voltage, temperature_degc, temp_ext_degc, rssi_db,
    node_id
  } = req.body;

  const sql = `
    UPDATE reports
    SET
      timestamp = ?, static_pressure_pa = ?, flow_lph = ?, gas_consumption_l = ?,
      battery_v = ?, battery_a = ?, solar_voltage = ?, temperature_degc = ?,
      temp_ext_degc = ?, rssi_db = ?, node_id = ?, updated_at = NOW()
    WHERE id = ?
  `;
  db.query(
    sql,
    [
      timestamp, static_pressure_pa, flow_lph, gas_consumption_l,
      battery_v, battery_a, solar_voltage, temperature_degc, temp_ext_degc, rssi_db,
      node_id, id
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Report not found' });
      }
      res.json({ message: 'Report updated' });
    }
  );
};

exports.deleteReport = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM reports WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ message: 'Report deleted' });
  });
};
