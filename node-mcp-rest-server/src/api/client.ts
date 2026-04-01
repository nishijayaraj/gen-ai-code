import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // replace with your API
  timeout: 5000,
});

export default api;
