// server/controllers/auth.controller.js
const db = require('../models'); // убедитесь, что модель User экспортируется из db.models
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = db.User; // Предполагается, что модель пользователя называется User

// Регистрация нового пользователя
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Все поля обязательны.' });
    }
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email уже используется.' });
    }
    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    // Создаём нового пользователя с role_id = 1 (обычный пользователь)
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role_id: 1
    });
    // Можно добавить отправку письма с подтверждением регистрации здесь
    res.status(201).json({ message: 'Регистрация прошла успешно.', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
  }
};

// Вход в систему
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны.' });
    }
    // Ищем пользователя по email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }
    // Проверяем корректность пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный пароль.' });
    }
    // Формируем JWT-токен (на 1 час). В payload передаём id и роль пользователя.
    const token = jwt.sign(
      { id: user.id, role: user.role_id },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Вход выполнен успешно.', token, role: user.role_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Внутренняя ошибка сервера.' });
  }
};

module.exports = {
  register,
  login
};
