const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./b2b_db.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `, (err) => {
    if (err) console.error('Error creating users table:', err);
  });

  // Check if products table has the correct columns
  db.all("PRAGMA table_info(products)", [], (err, columns) => {
    if (err) {
      console.error('Error checking table info:', err);
      return;
    }
    const hasStock = columns.some(col => col.name === 'stock');
    const hasCategory = columns.some(col => col.name === 'category');
    const hasDescription = columns.some(col => col.name === 'description');

    if (!hasStock || !hasCategory || hasDescription) {
      // Drop and recreate table
      db.run("DROP TABLE IF EXISTS products", [], (err) => {
        if (err) console.error('Error dropping products table:', err);
        else {
          db.run(`
            CREATE TABLE products (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT,
              price REAL,
              stock INTEGER,
              category TEXT,
              image TEXT,
              supplier_id INTEGER,
              FOREIGN KEY (supplier_id) REFERENCES users(id)
            )
          `, (err) => {
            if (err) console.error('Error creating products table:', err);
          });
        }
      });
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      buyer_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      total_price REAL,
      FOREIGN KEY (buyer_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `, (err) => {
    if (err) console.error('Error creating orders table:', err);
  });
});

module.exports = db;
