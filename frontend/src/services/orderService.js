import API from "./api";

export const createOrder = async (data) => {
  const res = await API.post("/orders", data);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await API.get("/orders/my-orders");
  return res.data;
};