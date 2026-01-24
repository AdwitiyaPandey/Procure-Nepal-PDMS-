const pool = require("../db/db");

// 1️ View all products
exports.getProducts = async (req, res) => {
  const products = await pool.query(`
    SELECT products.*, users.name AS supplier_name
    FROM products
    JOIN users ON products.supplier_id = users.id
  `);
  res.json(products.rows);
};

// 2️ Place order
exports.placeOrder = async (req, res) => {
  const buyerId = req.user.id;
  const { product_id, quantity } = req.body;

  const product = await pool.query(
    "SELECT price FROM products WHERE id=$1",
    [product_id]
  );

  const total = product.rows[0].price * quantity;

  await pool.query(
    `INSERT INTO orders (buyer_id, product_id, quantity, total_price)
     VALUES ($1, $2, $3, $4)`,
    [buyerId, product_id, quantity, total]
  );

  res.json({ message: "Order placed successfully" });
};

// 3️ View buyer orders
exports.getOrders = async (req, res) => {
  const buyerId = req.user.id;

  const orders = await pool.query(`
    SELECT orders.*, products.name
    FROM orders
    JOIN products ON orders.product_id = products.id
    WHERE buyer_id=$1
  `, [buyerId]);

  res.json(orders.rows);
};
