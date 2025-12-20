const express = require("express");
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running successfully");
});

app.use("/api/auth", require("./routes/authRoutes"));

app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: "This is protected data",
    user: req.user
  });
});

app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
