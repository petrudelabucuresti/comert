require("dotenv").config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  appName: process.env.APP_NAME || "App",
  testMessage: process.env.TEST_MESSAGE || "No message",
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};

module.exports = config;