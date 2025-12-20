const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      const user = result[0];

      const isPasswordCorrect = bcrypt.compareSync(
        password,
        user.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
        );


      res.json({
        message: "Login successful",
        token
      });
    }
  );
};

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: "User registered successfully" });
    }
  );
};
