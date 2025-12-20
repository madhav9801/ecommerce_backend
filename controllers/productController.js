const db = require("../config/db");

/**
 * GET all products
 */
exports.getProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
};

/**
 * ADD product
 */
exports.addProduct = (req, res) => {
  const { name, price, stock } = req.body;

  db.query(
    "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
    [name, price, stock],
    (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: "Product added successfully" });
    }
  );
};
