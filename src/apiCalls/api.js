import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "./constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tasks
// Read
export const getAllProducts = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.PRODUCTS);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
