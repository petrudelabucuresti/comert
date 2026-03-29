const express = require("express");
const router = express.Router();

const {
  calculateCake,
  addCustomCakeToCart,
} = require("../controllers/customCakeController");

router.post("/calculate", calculateCake);
router.post("/add-to-cart", addCustomCakeToCart);

module.exports = router;