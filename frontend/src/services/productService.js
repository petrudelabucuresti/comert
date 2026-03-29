import API from "./api";

export const getProducts = async (params = {}) => {
  const res = await API.get("/products", { params });
  return res.data;
};

export const getProductById = async (id) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await API.post("/products", data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await API.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};