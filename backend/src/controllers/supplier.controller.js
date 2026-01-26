const db = require("../db/db");

/**
 * 1️⃣ Add product
 */
exports.addProduct = (req, res) => {
  const supplierId = req.user.id;
  const { name, price, stock, category } = req.body;
  const image = req.file ? req.file.filename : null;

  db.run(
    `INSERT INTO products (supplier_id, name, price, stock, category, image)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [supplierId, name, price, stock, category, image],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to add product" });
      }
      res.json({ message: "Product added successfully" });
    }
  );
};

/*
  2️ View supplier products
 */
exports.getMyProducts = (req, res) => {
  const supplierId = req.user.id;

  db.all(
    "SELECT * FROM products WHERE supplier_id = ?",
    [supplierId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch products" });
      }
      res.json(rows);
    }
  );
};

/**
 * 3️ View orders on supplier products
 */
exports.getSupplierOrders = (req, res) => {
  const supplierId = req.user.id;

  db.all(
    `
    SELECT orders.*, products.name AS product_name, users.name AS buyer_name
    FROM orders
    JOIN products ON orders.product_id = products.id
    JOIN users ON orders.buyer_id = users.id
    WHERE products.supplier_id = ?
  `,
    [supplierId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch orders" });
      }
      res.json(rows);
    }
  );
};
