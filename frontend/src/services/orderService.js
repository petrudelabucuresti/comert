import API from "./api";

export const createOrder = async (data) => {
  const res = await API.post("/orders", data);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await API.get("/orders/my-orders");
  return res.data;
};

export const getAllOrdersAdmin = async () => {
  const res = await API.get("/orders");
  return res.data;
};

export const updateOrderStatusAdmin = async (id, orderStatus) => {
  const res = await API.patch(`/orders/${id}/status`, { orderStatus });
  return res.data;
};

export const updatePaymentStatusAdmin = async (id, paymentStatus) => {
  const res = await API.patch(`/orders/${id}/payment-status`, { paymentStatus });
  return res.data;
};