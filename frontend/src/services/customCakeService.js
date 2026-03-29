import API from "./api";

export const calculateCustomCake = async (data) => {
  const res = await API.post("/custom-cake/calculate", data);
  return res.data;
};

export const addCustomCakeToCart = async (data) => {
  const res = await API.post("/custom-cake/add-to-cart", data);
  return res.data;
};