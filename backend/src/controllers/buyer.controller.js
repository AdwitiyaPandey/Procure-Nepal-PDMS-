const db = require("../db/db");

// 1️ View all products
exports.getProducts = async (req, res) => {
  db.all(`
    SELECT products.*, users.name AS supplier_name
    FROM products
    JOIN users ON products.supplier_id = users.id
  `, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }
    res.json(rows);
  });
};

// 2️ Place order
exports.placeOrder = async (req, res) => {
  const buyerId = req.user.id;
  const { product_id, quantity } = req.body;

  db.get(
    "SELECT price FROM products WHERE id=?",
    [product_id],
    (err, product) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to place order" });
      }

      const total = product.price * quantity;

      db.run(
        `INSERT INTO orders (buyer_id, product_id, quantity, total_price)
         VALUES (?, ?, ?, ?)`,
        [buyerId, product_id, quantity, total],
        function(err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to place order" });
          }
          res.json({ message: "Order placed successfully" });
        }
      );
    }
  );
};

// 3️ View buyer orders
exports.getOrders = async (req, res) => {
  const buyerId = req.user.id;

  db.all(`
    SELECT orders.*, products.name
    FROM orders
    JOIN products ON orders.product_id = products.id
    WHERE buyer_id=?
  `, [buyerId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch orders" });
    }
    res.json(rows);
  });
};
