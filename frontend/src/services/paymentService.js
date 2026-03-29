import API from "./api";

export const createCheckoutSession = async (orderId) => {
  const res = await API.post("/payments/create-checkout-session", {
    orderId,
  });

  return res.data;
};