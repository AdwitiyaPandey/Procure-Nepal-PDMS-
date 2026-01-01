const db = require("../db/db");
const jwt = require("jsonwebtoken");

// Hardcoded admin credentials (change as needed)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin@procure.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AdminPass123";

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign({ id: 0, role: "admin" }, "SECRET_KEY");
    res.json({ token, role: "admin" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Admin login failed" });
  }
};

// Report: duplicate items (group by name)
exports.getDuplicateItems = (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  db.all(
    `SELECT name, COUNT(*) as count, GROUP_CONCAT(id) as ids FROM products GROUP BY name HAVING COUNT(*) > 1`,
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch duplicates" });
      }
      res.json(rows);
    }
  );
};

// Report: sexual items (basic keyword search)
exports.getSexualItems = (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const keywords = ["sex", "sexual", "porn", "adult"];
  const likeClauses = keywords.map(() => "LOWER(name) LIKE ? OR LOWER(category) LIKE ?").join(" OR ");
  const params = [];
  keywords.forEach(k => {
    params.push(`%${k}%`, `%${k}%`);
  });

  const query = `SELECT * FROM products WHERE ${likeClauses}`;

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch sexual items" });
    }
    res.json(rows);
  });
};

// Ban a user (buyer or supplier)
exports.banUser = (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "userId required" });

  db.run("UPDATE users SET banned = 1 WHERE id = ?", [userId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to ban user" });
    }
    res.json({ message: "User banned" });
  });
};

// Flag a user
exports.flagUser = (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "userId required" });

  db.run("UPDATE users SET flagged = 1 WHERE id = ?", [userId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to flag user" });
    }
    res.json({ message: "User flagged" });
  });
};
