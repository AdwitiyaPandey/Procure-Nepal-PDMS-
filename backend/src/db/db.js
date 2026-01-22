const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "b2b_db",
  password: "adwi",
  port: 5432
});

module.exports = pool;
