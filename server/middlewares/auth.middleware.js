// server/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

// Проверка наличия и корректности JWT-токена
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Токен не предоставлен.' });
  }
  jwt.verify(token, process.env.JWT_SECRET || '2a751a4e6d638cfc403108650cae2f56f1f91b185aea7393c959fa254172adc3d02035af272ca3b7c1502b08c55c82fd8cc354f62e463323038b91ae6ee9c7f4', (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка аутентификации токена.' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Проверка, что пользователь – администратор (role_id = 2)
const isAdmin = (req, res, next) => {
  if (req.userRole !== 2) {
    return res.status(403).json({ message: 'Требуется роль администратора.' });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin
};
