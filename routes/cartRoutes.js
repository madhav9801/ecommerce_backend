const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addToCart,
  getCart,
  removeFromCart
} = require("../controllers/cartController");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/remove", authMiddleware, removeFromCart);

module.exports = router;
