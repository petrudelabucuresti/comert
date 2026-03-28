const { body } = require("express-validator");

const createOrderValidator = [
  body("customer.name").notEmpty().withMessage("Name is required"),

  body("customer.email")
    .isEmail()
    .withMessage("Valid email required"),

  body("customer.phone")
    .notEmpty()
    .withMessage("Phone is required"),

  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain items"),

  body("paymentMethod")
    .optional()
    .isIn(["card", "cash"])
    .withMessage("Invalid payment method"),
];

module.exports = { createOrderValidator };