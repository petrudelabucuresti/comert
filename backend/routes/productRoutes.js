const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
} = require("../controllers/productController");

const { getProductsValidator } = require("../validators/productValidator");
const validate = require("../middleware/validateMiddleware");

// GET all products + filters
router.get("/", getProductsValidator, validate, getProducts);

// GET single product
router.get("/:id", getProductById);

module.exports = router;