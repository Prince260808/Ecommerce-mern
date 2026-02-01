import axios from "axios";

const api = axios.create({
  baseURL: "https://mern-ecommerce-hxvb.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

