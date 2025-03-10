// server\controllers\nodes.controller.js
const db = require('../models');

exports.getAllNodes = (req, res) => {
  const sql = 'SELECT * FROM nodes';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getNodeById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM nodes WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Node not found' });
    res.json(results[0]);
  });
};

exports.createNode = (req, res) => {
  const {
    external_id, installation_date, digester_id
  } = req.body;

  const sql = `
    INSERT INTO nodes (
      external_id, installation_date, digester_id, created_at, updated_at
    ) VALUES (?, ?, ?, NOW(), NOW())
  `;
  db.query(
    sql,
    [external_id, installation_date, digester_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    }
  );
};

exports.updateNode = (req, res) => {
  const { id } = req.params;
  const {
    external_id, installation_date, digester_id
  } = req.body;

  const sql = `
    UPDATE nodes
    SET external_id = ?, installation_date = ?, digester_id = ?, updated_at = NOW()
    WHERE id = ?
  `;
  db.query(
    sql,
    [external_id, installation_date, digester_id, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Node not found' });
      }
      res.json({ message: 'Node updated' });
    }
  );
};

exports.deleteNode = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM nodes WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Node not found' });
    }
    res.json({ message: 'Node deleted' });
  });
};
