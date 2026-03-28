const { body } = require("express-validator");

const addToCartValidator = [
  body("sessionId").notEmpty().withMessage("Session ID is required"),
  body("productId").notEmpty().withMessage("Product ID is required"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

const updateCartValidator = [
  body("sessionId").notEmpty(),
  body("productId").notEmpty(),
  body("quantity").isInt({ min: 1 }),
];

module.exports = {
  addToCartValidator,
  updateCartValidator,
};