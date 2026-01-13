import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api", 
    "Content-Type": "application/json",
  }
);

export default api;
