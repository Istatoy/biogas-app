// server/middlewares/auth.middleware.js
require('dotenv').config(); // Если не загружается в главном файле
const jwt = require('jsonwebtoken');

// Получаем секрет из переменной окружения
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET не определён. Проверьте настройки переменных окружения!');
}

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Malformed token' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = decoded.userId;
    req.roleId = decoded.roleId;
    next();
  });
};

exports.requireRole = (roles) => {
  return (req, res, next) => {
    // roles - массив разрешённых ролей (например ['admin'])
    // req.roleId - текущая роль пользователя
    // Нужно проверить, есть ли у пользователя соответствующая роль
    // (например, хранить в БД roles.id = 1 => admin, 2 => manager и т.п.)
    if (!roles.includes(req.roleId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};
