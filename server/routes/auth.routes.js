// server/routes/auth.routes.js
require('dotenv').config(); // Загружаем переменные окружения

const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');

// Получаем секрет из переменной окружения
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET не определён! Проверьте файл .env');
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND status = "active"';

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = results[0];

    // Сравниваем пароль
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Генерируем токен
    const token = jwt.sign(
      { userId: user.id, roleId: user.role_id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  });
});

module.exports = router;
