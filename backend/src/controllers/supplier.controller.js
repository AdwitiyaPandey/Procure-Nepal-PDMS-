const db = require("../db/db");

// Add product
exports.addProduct = (req, res) => {
  const supplierId = req.user.id;
  const { name, price, stock, category } = req.body;
  const image = req.file?.filename || null;

  db.run(
    `
    INSERT INTO products (supplier_id, name, price, stock, category, image)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [supplierId, name, price, stock, category, image],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to add product" });
      }

      res.status(201).json({
        message: "Product added successfully",
        productId: this.lastID
      });
    }
  );
};

// View supplier products
exports.getMyProducts = (req, res) => {
  const supplierId = req.user.id;

  db.all(
    "SELECT * FROM products WHERE supplier_id = ?",
    [supplierId],
    (err, products) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch products" });
      }
      res.json(products);
    }
  );
};

// View orders for supplier products
exports.getSupplierOrders = (req, res) => {
  const supplierId = req.user.id;

  db.all(
    `
    SELECT 
      orders.id,
      orders.quantity,
      orders.total_price,
      orders.created_at,
      products.name AS product_name,
      users.name AS buyer_name
    FROM orders
    JOIN products ON orders.product_id = products.id
    JOIN users ON orders.buyer_id = users.id
    WHERE products.supplier_id = ?
    ORDER BY orders.created_at DESC
    `,
    [supplierId],
    (err, orders) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch orders" });
      }
      res.json(orders);
    }
  );
};
