const express = require("express");
const router = express.Router();

const {
  createCheckoutSession,
  stripeWebhook,
} = require("../controllers/paymentController");

router.post("/webhook", stripeWebhook);
router.post("/create-checkout-session", createCheckoutSession);

module.exports = router;