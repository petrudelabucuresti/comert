import API from "./api";

export const getCart = async (sessionId) => {
  const res = await API.get(`/cart/${sessionId}`);
  return res.data;
};

export const addToCart = async (data) => {
  const res = await API.post("/cart/add", data);
  return res.data;
};

export const updateCart = async (data) => {
  const res = await API.put("/cart/update", data);
  return res.data;
};

export const removeFromCart = async (data) => {
  const res = await API.delete("/cart/remove", { data });
  return res.data;
};