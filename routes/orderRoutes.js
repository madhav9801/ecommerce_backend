const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  placeOrder,
  getOrderHistory
} = require("../controllers/orderController");

router.post("/place", authMiddleware, placeOrder);
router.get("/history", authMiddleware, getOrderHistory);

module.exports = router;
