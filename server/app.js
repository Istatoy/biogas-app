// D:\biogas-app\server\app.js
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение маршрутов
const customersRoutes = require('./routes/customers.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const digestersRoutes = require('./routes/digesters.routes');
const nodesRoutes = require('./routes/nodes.routes');
const reportsRoutes = require('./routes/reports.routes');

// Регистрация маршрутов
app.use('/api/customers', customersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/digesters', digestersRoutes);
app.use('/api/nodes', nodesRoutes);
app.use('/api/reports', reportsRoutes);

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
