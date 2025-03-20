const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const customersRoutes = require('./routes/customers.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const digestersRoutes = require('./routes/digesters.routes');
const nodesRoutes = require('./routes/nodes.routes');
const reportsRoutes = require('./routes/reports.routes');

// Регистрация маршрутов
app.use('/api/auth', authRoutes);
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
