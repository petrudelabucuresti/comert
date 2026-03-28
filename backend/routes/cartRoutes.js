const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cartController");

const {
  addToCartValidator,
  updateCartValidator,
} = require("../validators/cartValidator");

const validate = require("../middleware/validateMiddleware");

// GET
router.get("/:sessionId", getCart);

// ADD
router.post("/add", addToCartValidator, validate, addToCart);

// UPDATE
router.put("/update", updateCartValidator, validate, updateCart);

// REMOVE
router.delete("/remove", removeFromCart);

module.exports = router;