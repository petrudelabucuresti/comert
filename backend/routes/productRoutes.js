const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
} = require("../controllers/productController");

const { getProductsValidator } = require("../validators/productValidator");
const validate = require("../middleware/validateMiddleware");
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

// PUBLIC
router.get("/", getProductsValidator, validate, getProducts);
router.get("/:id", getProductById);

// ADMIN
router.post("/", protect, isAdmin, createProductAdmin);
router.put("/:id", protect, isAdmin, updateProductAdmin);
router.delete("/:id", protect, isAdmin, deleteProductAdmin);

module.exports = router;