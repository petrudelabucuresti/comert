const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const validate = require("../middleware/validateMiddleware");
const optionalAuth = require("../middleware/optionalAuthMiddleware");

const {
  createNewOrder,
  getOrderById,
  getOrderConfirmation,
  getMyOrders,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  updatePaymentStatusAdmin,
} = require("../controllers/orderController");

const { createOrderValidator } = require("../validators/orderValidator");

// PUBLIC / USER
router.post("/", optionalAuth, createOrderValidator, validate, createNewOrder);
router.get("/confirmation/:orderNumber", getOrderConfirmation);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// ADMIN
router.get("/", protect, isAdmin, getAllOrdersAdmin);
router.patch("/:id/status", protect, isAdmin, updateOrderStatusAdmin);
router.patch("/:id/payment-status", protect, isAdmin, updatePaymentStatusAdmin);

module.exports = router;