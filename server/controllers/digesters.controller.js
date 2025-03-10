// server\controllers\digesters.controller.js
const db = require('../models');

exports.getAllDigesters = (req, res) => {
  const sql = 'SELECT * FROM digesters';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getDigesterById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM digesters WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Digester not found' });
    res.json(results[0]);
  });
};

exports.createDigester = (req, res) => {
  const {
    external_id, type, lat, lng, installation_date, installation_notes,
    total_digester_volume, digester_biogas_capacity, stove_rings_amount,
    external_reference, customer_id
  } = req.body;

  const sql = `
    INSERT INTO digesters (
      external_id, type, lat, lng, installation_date, installation_notes,
      total_digester_volume, digester_biogas_capacity, stove_rings_amount,
      external_reference, customer_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  db.query(
    sql,
    [
      external_id, type, lat, lng, installation_date, installation_notes,
      total_digester_volume, digester_biogas_capacity, stove_rings_amount,
      external_reference, customer_id
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    }
  );
};

exports.updateDigester = (req, res) => {
  const { id } = req.params;
  const {
    external_id, type, lat, lng, installation_date, installation_notes,
    total_digester_volume, digester_biogas_capacity, stove_rings_amount,
    external_reference, customer_id
  } = req.body;

  const sql = `
    UPDATE digesters
    SET
      external_id = ?, type = ?, lat = ?, lng = ?, installation_date = ?,
      installation_notes = ?, total_digester_volume = ?, digester_biogas_capacity = ?,
      stove_rings_amount = ?, external_reference = ?, customer_id = ?, updated_at = NOW()
    WHERE id = ?
  `;
  db.query(
    sql,
    [
      external_id, type, lat, lng, installation_date, installation_notes,
      total_digester_volume, digester_biogas_capacity, stove_rings_amount,
      external_reference, customer_id, id
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Digester not found' });
      }
      res.json({ message: 'Digester updated' });
    }
  );
};

exports.deleteDigester = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM digesters WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Digester not found' });
    }
    res.json({ message: 'Digester deleted' });
  });
};
