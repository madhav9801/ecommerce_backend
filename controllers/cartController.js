const db = require("../config/db");

/**
 * ADD product to cart
 */
exports.addToCart = (req, res) => {
  const { product_id, quantity } = req.body;
  const userId = req.user.id;

  db.query(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
    [userId, product_id, quantity],
    (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: "Product added to cart" });
    }
  );
};

/**
 * GET logged-in user's cart
 */
exports.getCart = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT c.id, p.name, p.price, c.quantity
     FROM cart c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    }
  );
};

/**
 * REMOVE product from cart
 */
exports.removeFromCart = (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;

  const query =
    "DELETE FROM cart WHERE user_id = ? AND product_id = ?";

  db.query(query, [userId, product_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    res.json({ message: "Product removed from cart" });
  });
};
