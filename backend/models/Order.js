const createOrder = (data) => {
  const now = new Date().toISOString();

  return {
    orderNumber: `ORD-${Date.now()}`,
    userId: data.userId || null,

    customer: {
      name: data.customer.name,
      email: data.customer.email,
      phone: data.customer.phone,
      address: data.customer.address,
    },

    items: data.items,

    subtotal: data.subtotal,
    deliveryFee: data.deliveryFee || 0,
    total: data.total,

    paymentMethod: data.paymentMethod || "card",
    paymentStatus: "pending",
    orderStatus: "pending",

    stripeSessionId: null,

    createdAt: now,
    updatedAt: now,
  };
};

module.exports = { createOrder };