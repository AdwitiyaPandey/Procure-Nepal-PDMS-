const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const {
  getProducts,
  placeOrder,
  getOrders
} = require("../controllers/buyer.controller");

router.get("/products", auth, getProducts);
router.post("/order", auth, placeOrder);
router.get("/orders", auth, getOrders);

module.exports = router;
