const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./b2b_db.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      banned INTEGER DEFAULT 0,
      flagged INTEGER DEFAULT 0,
      verified INTEGER DEFAULT 0,
      verification_image TEXT,
      credentials TEXT
    )
  `, (err) => {
    if (err) console.error('Error creating users table:', err);
  });

  // Ensure products table exists with expected columns
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_id INTEGER,
      name TEXT,
      price REAL,
      stock INTEGER DEFAULT 0,
      category TEXT,
      image TEXT,
      FOREIGN KEY (supplier_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Error creating products table:', err);
  });

  // Check if products table has the correct columns
  db.all("PRAGMA table_info(products)", [], (err, columns) => {
    if (err) {
      console.error('Error checking table info:', err);
      return;
    }
    const hasStock = columns.some(col => col.name === 'stock');
    const hasCategory = columns.some(col => col.name === 'category');

    if (!hasStock || !hasCategory) {
      // Add missing columns
      if (!hasStock) {
        db.run("ALTER TABLE products ADD COLUMN stock INTEGER", (err) => {
          if (err) console.error('Error adding stock column:', err);
        });
      }
      if (!hasCategory) {
        db.run("ALTER TABLE products ADD COLUMN category TEXT", (err) => {
          if (err) console.error('Error adding category column:', err);
        });
      }
    }
  });

  // Ensure users table has banned and flagged columns
  db.all("PRAGMA table_info(users)", [], (err, cols) => {
    if (err) return console.error('Error checking users table info:', err);
    const hasBanned = cols.some(c => c.name === 'banned');
    const hasFlagged = cols.some(c => c.name === 'flagged');
    const hasVerified = cols.some(c => c.name === 'verified');
    const hasVerificationImage = cols.some(c => c.name === 'verification_image');
    const hasCredentials = cols.some(c => c.name === 'credentials');
    if (!hasBanned) {
      db.run("ALTER TABLE users ADD COLUMN banned INTEGER DEFAULT 0", (err) => {
        if (err) console.error('Error adding banned column:', err);
      });
    }
    if (!hasFlagged) {
      db.run("ALTER TABLE users ADD COLUMN flagged INTEGER DEFAULT 0", (err) => {
        if (err) console.error('Error adding flagged column:', err);
      });
    }
    if (!hasVerified) {
      db.run("ALTER TABLE users ADD COLUMN verified INTEGER DEFAULT 0", (err) => {
        if (err) console.error('Error adding verified column:', err);
      });
    }
    if (!hasVerificationImage) {
      db.run("ALTER TABLE users ADD COLUMN verification_image TEXT", (err) => {
        if (err) console.error('Error adding verification_image column:', err);
      });
    }
    if (!hasCredentials) {
      db.run("ALTER TABLE users ADD COLUMN credentials TEXT", (err) => {
        if (err) console.error('Error adding credentials column:', err);
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
