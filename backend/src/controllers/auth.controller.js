const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// In-memory users store for demo
let users = [];
let nextId = 1;

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = users.find(u => u.email === email);
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = { id: nextId++, name, email, password: hashedPassword, role };
    users.push(user);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
