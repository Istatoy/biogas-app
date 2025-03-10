// server/controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Загружаем переменные окружения

// Получаем секрет из переменной окружения
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not определён. Проверьте переменные окружения!');
}

exports.login = (connection) => (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND status = "active"';
  connection.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = results[0];
    // Сравниваем пароль
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Генерируем токен
    const token = jwt.sign({ userId: user.id, roleId: user.role_id }, JWT_SECRET, {
      expiresIn: '1d'
    });
    res.json({ token });
  });
};
