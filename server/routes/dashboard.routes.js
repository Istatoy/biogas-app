// D:\biogas-app\server\routes\dashboard.routes.js
const express = require('express');
const router = express.Router();
const db = require('../models');

// Получить статистику для Dashboard
router.get('/', (req, res) => {
  const stats = {};
  // Считаем количество клиентов
  db.query('SELECT COUNT(*) AS count FROM customers', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.customersCount = results[0].count;
    // Количество digesters
    db.query('SELECT COUNT(*) AS count FROM digesters', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.digestersCount = results[0].count;
      // Количество nodes
      db.query('SELECT COUNT(*) AS count FROM nodes', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.nodesCount = results[0].count;
        // Для примера "Active Digesters" — можно задать условие, например, если system_status = 'active' или иное;
        // Здесь в таблице digesters нет отдельного поля, поэтому временно используем общее количество
        stats.activeDigesters = stats.digestersCount;
        res.json(stats);
      });
    });
  });
});

module.exports = router;
