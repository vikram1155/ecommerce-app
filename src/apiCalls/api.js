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

export const postProduct = async (productData) => {
  try {
    const response = await api.post(API_ENDPOINTS.PRODUCTS, productData);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const updateProduct = async (productId, updatedData) => {
  try {
    const response = await api.put(
      `${API_ENDPOINTS.PRODUCTS}/${productId}`,
      updatedData
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update product");
  }
};
