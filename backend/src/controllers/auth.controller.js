const db = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    // When using multer, file is in req.file and fields in req.body
    const { name, email, password, role, businessName, registrationNumber } = req.body;
    const verificationImage = req.file ? req.file.filename : null;

    // 1. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. INSERT INTO DATABASE
    // If supplier, store credentials and verification image; suppliers start as unverified
    if (role === 'supplier') {
      const credentials = JSON.stringify({ businessName: businessName || null, registrationNumber: registrationNumber || null });
      db.run(
        "INSERT INTO users (name, email, password, role, verification_image, credentials, verified) VALUES (?, ?, ?, ?, ?, ?, 0)",
        [name, email, hashedPassword, role, verificationImage, credentials],
        function(err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Registration failed" });
          }
          res.status(201).json({ message: "Supplier registered — pending verification" });
        }
      );
    } else {
      db.run(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role],
        function(err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Registration failed" });
          }
          res.status(201).json({ message: "User registered successfully" });
        }
      );
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Login failed" });
      }

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // 2. Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // 3. Generate JWT
      const token = jwt.sign({ id: user.id, role: user.role }, "SECRET_KEY");

      res.json({ token, role: user.role });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};
