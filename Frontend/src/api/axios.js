import axios from "axios";

const api = axios.create({
  baseURL: "https://my-ecommerce-qcw9.onrender.com/api", // new backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
