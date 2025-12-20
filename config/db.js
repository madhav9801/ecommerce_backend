const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Gthmf069@",
  database: "ecommerce"
});

module.exports = db;
