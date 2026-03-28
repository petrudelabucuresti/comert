const { query } = require("express-validator");

const getProductsValidator = [
  query("category").optional().isString(),
  query("search").optional().isString(),

  query("minPrice").optional().isFloat({ min: 0 }),
  query("maxPrice").optional().isFloat({ min: 0 }),

  query("flavor").optional().isString(),
  query("dietary").optional().isString(),
  query("occasion").optional().isString(),

  query("excludeAllergen").optional().isString(),
];

module.exports = { getProductsValidator };