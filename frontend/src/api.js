import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getProducts = () => API.get("/products");
export const getCart = () => API.get("/cart");
export const addToCart = (data) => API.post("/cart", data);
export const removeFromCart = (id) => API.delete(`/cart/${id}`);
export const checkout = (data) => API.post("/checkout", data);
