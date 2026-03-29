const { body } = require("express-validator");

const createOrderValidator = [
  body("sessionId").notEmpty().withMessage("Session ID is required"),

  body("customer.name").notEmpty().withMessage("Name is required"),

  body("customer.email").isEmail().withMessage("Valid email required"),

  body("customer.phone").notEmpty().withMessage("Phone is required"),

  body("customer.address").notEmpty().withMessage("Address is required"),

  body("paymentMethod")
    .optional()
    .isIn(["card", "cash"])
    .withMessage("Invalid payment method"),
];

module.exports = { createOrderValidator };