const { db } = require("../db");
const { createOrder } = require("../models/Order");

const createNewOrder = async (req, res, next) => {
  try {
    const { sessionId, customer, paymentMethod } = req.body;

    const cartSnapshot = await db
      .collection("carts")
      .where("sessionId", "==", sessionId)
      .limit(1)
      .get();

    if (cartSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartDoc = cartSnapshot.docs[0];
    const cartData = cartDoc.data();

    if (!cartData.items || cartData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

for (const item of cartData.items) {
  if (item.custom) {
    continue;
  }

  const productDoc = await db.collection("products").doc(item.productId).get();

  if (!productDoc.exists) {
    return res.status(404).json({
      success: false,
      message: `Product not found: ${item.name}`,
    });
  }

  const product = productDoc.data();

  if (!product.isAvailable || product.stock < item.quantity) {
    return res.status(400).json({
      success: false,
      message: `Insufficient stock for product: ${item.name}`,
    });
  }
}
    const subtotal = cartData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const deliveryFee = subtotal >= 200 ? 0 : 20;
    const total = subtotal + deliveryFee;

    const orderData = createOrder({
      userId: req.user ? req.user.id : null,
      customer,
      items: cartData.items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: paymentMethod || "card",
    });

    const orderRef = db.collection("orders").doc();
    await orderRef.set(orderData);

for (const item of cartData.items) {
  if (item.custom) {
    continue;
  }

  const productRef = db.collection("products").doc(item.productId);
  const productDoc = await productRef.get();

  if (productDoc.exists) {
    const product = productDoc.data();

    await productRef.update({
      stock: product.stock - item.quantity,
      updatedAt: new Date().toISOString(),
    });
  }
}

    await db.collection("carts").doc(cartDoc.id).delete();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        id: orderRef.id,
        ...orderData,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const doc = await db.collection("orders").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = doc.data();

    const userDoc = await db.collection("users").doc(req.user.id).get();
    const user = userDoc.exists ? userDoc.data() : null;

    const isAdmin = user?.role === "admin";
    const isOwner = order.userId && order.userId === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...order,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrderConfirmation = async (req, res, next) => {
  try {
    const snapshot = await db
      .collection("orders")
      .where("orderNumber", "==", req.params.orderNumber)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const orderDoc = snapshot.docs[0];

    res.json({
      success: true,
      data: {
        id: orderDoc.id,
        ...orderDoc.data(),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const snapshot = await db
      .collection("orders")
      .where("userId", "==", req.user.id)
      .get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN - GET ALL ORDERS
const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const snapshot = await db.collection("orders").get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN - UPDATE ORDER STATUS
const updateOrderStatusAdmin = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const orderId = req.params.id;

    const allowedStatuses = ["pending", "confirmed", "preparing", "delivered", "cancelled"];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const orderRef = db.collection("orders").doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await orderRef.update({
      orderStatus,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Order status updated",
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN - UPDATE PAYMENT STATUS
const updatePaymentStatusAdmin = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    const orderId = req.params.id;

    const allowedStatuses = ["pending", "paid", "failed"];

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const orderRef = db.collection("orders").doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await orderRef.update({
      paymentStatus,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Payment status updated",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewOrder,
  getOrderById,
  getOrderConfirmation,
  getMyOrders,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  updatePaymentStatusAdmin,
};