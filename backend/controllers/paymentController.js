const Stripe = require("stripe");
const config = require("../config");
const { db } = require("../db");

const stripe = new Stripe(config.stripeSecretKey);

// CREATE CHECKOUT SESSION
const createCheckoutSession = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const orderDoc = await db.collection("orders").doc(orderId).get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orderDoc.data();

    if (!order.items || order.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order has no items",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order already paid",
      });
    }

    const line_items = order.items.map((item) => ({
      price_data: {
        currency: "ron",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (order.deliveryFee && order.deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: "ron",
          product_data: {
            name: "Taxă livrare",
          },
          unit_amount: Math.round(order.deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      customer_email: order.customer?.email || undefined,
      metadata: {
        orderId,
        orderNumber: order.orderNumber,
      },
     success_url: `${config.frontendUrl}/success?order=${order.orderNumber}`,
cancel_url: `${config.frontendUrl}/cancel?order=${order.orderNumber}`,
    });

    await db.collection("orders").doc(orderId).update({
      stripeSessionId: session.id,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Checkout session created",
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    next(error);
  }
};

// STRIPE WEBHOOK
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripeWebhookSecret
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await db.collection("orders").doc(orderId).update({
          paymentStatus: "paid",
          orderStatus: "confirmed",
          updatedAt: new Date().toISOString(),
        });
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await db.collection("orders").doc(orderId).update({
          paymentStatus: "failed",
          updatedAt: new Date().toISOString(),
        });
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook DB update error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};

module.exports = {
  createCheckoutSession,
  stripeWebhook,
};