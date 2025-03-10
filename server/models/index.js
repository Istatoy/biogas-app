// server/models/index.js
const mysql = require('mysql2');
const dbConfig = require('../config/db.config');

const connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

module.exports = connection;
