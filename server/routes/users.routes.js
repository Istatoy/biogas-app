// server\routes\users.routes.js
const router = require('express').Router();
const usersController = require('../controllers/users.controller');

// Здесь можно добавить middleware авторизации, чтобы доступ к пользователям был только у админа
// const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
// router.use(verifyToken);
// router.use(requireRole([1])); // если 1 = admin

router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
