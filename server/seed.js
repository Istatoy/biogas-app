// server/seed.js
const db = require('./models');
const User = db.user;
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const adminEmail = 'codequeen@gmail.com';
    const adminExists = await User.findOne({ where: { email: adminEmail } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('adminPassword123', 10); // задайте надёжный пароль
      await User.create({
        first_name: 'Admin',
        last_name: 'User',
        email: adminEmail,
        password: hashedPassword,
        role_id: 1, // 1 – администратор
        status: 1
      });
      console.log('Администратор создан');
    } else {
      console.log('Администратор уже существует');
    }
  } catch (error) {
    console.error(error);
  }
}

createAdmin();
