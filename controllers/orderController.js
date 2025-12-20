const db = require("../config/db");

/**
 * PLACE ORDER FROM CART
 */
exports.placeOrder = (req, res) => {
  const userId = req.user.id;

  // 1. Get cart items
  const cartQuery = `
    SELECT c.product_id, c.quantity, p.price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.query(cartQuery, [userId], (err, cartItems) => {
    if (err) return res.status(500).json(err);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Calculate total amount
    let totalAmount = 0;
    cartItems.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    // 3. Create order
    db.query(
      "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
      [userId, totalAmount],
      (err, orderResult) => {
        if (err) return res.status(500).json(err);

        const orderId = orderResult.insertId;

        // 4. Insert order items
        const orderItemsQuery = `
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ?
        `;

        const values = cartItems.map(item => [
          orderId,
          item.product_id,
          item.quantity,
          item.price
        ]);

        db.query(orderItemsQuery, [values], err => {
          if (err) return res.status(500).json(err);

          // 5. Clear cart
          db.query(
            "DELETE FROM cart WHERE user_id = ?",
            [userId],
            () => {
              res.json({
                message: "Order placed successfully",
                orderId
              });
            }
          );
        });
      }
    );
  });
};

/**
 * GET ORDER HISTORY (Logged-in user)
 */
exports.getOrderHistory = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT 
      o.id AS order_id,
      o.total_amount,
      o.status,
      o.created_at,
      p.name,
      oi.quantity,
      oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
};
