const router = require("express").Router();
const { getProducts, addProduct } = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", getProducts);      // Public
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  addProduct
);     
module.exports = router;



