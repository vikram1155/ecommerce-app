import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "./constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tasks
// GET all products available
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

// Users
export const getAllUsersFromApi = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.USERS);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch all users");
  }
};

export const createUserApi = async (data) => {
  try {
    const response = await api.post(API_ENDPOINTS.USERS, data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create user");
  }
};

export const loginUserFromApi = async (data) => {
  try {
    const response = await api.post(API_ENDPOINTS.LOGIN, data);
    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

// Order APIs
export const getAllOrders = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.ORDERS); // Fetches all orders
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch all orders");
  }
};

export const getOrdersByUser = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const response = await api.get(`${API_ENDPOINTS.ORDERS}/user`, {
      params: { userId }, // Updated endpoint to match /orders/user
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user orders");
  }
};

export const postOrdersByUser = async (data) => {
  try {
    const response = await api.post(API_ENDPOINTS.ORDERS, data);
    return response.data;
  } catch (error) {
    console.error("Error posting cart data:", error);
    throw new Error("Failed to update cart");
  }
};

export const updateOrderByUser = async (userId, orderId, updatedData) => {
  try {
    const response = await api.put(
      `${API_ENDPOINTS.ORDERS}/${userId}/${orderId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order");
  }
};

// Cart APIs
// GET cart items for an user
export const getProductsInCartByUser = async (userId) => {
  try {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);

    const response = await api.get(
      `${API_ENDPOINTS.CART}?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch cart details");
  }
};

// POST cart items
export const postProductsInCartByUser = async (data) => {
  try {
    const response = await api.post(API_ENDPOINTS.CART, data);
    return response.data;
  } catch (error) {
    console.error("Error posting cart data:", error);
    throw new Error("Failed to update cart");
  }
};

// POST - remove one item at a time from cart
export const removeCartItem = async (userId, productId) => {
  try {
    const response = await api.post(API_ENDPOINTS.CART_REMOVE, {
      userId,
      productId,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to remove item from cart");
  }
};

// POST - empty cart after placing order
export const clearCartByUser = async (data) => {
  try {
    const response = await api.post(API_ENDPOINTS.CART, data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to empty cart");
  }
};

// POST - update favourites
export const updateFavorites = async (userId, data) => {
  try {
    const response = await api.post(
      `${API_ENDPOINTS.USERS}/${userId}${API_ENDPOINTS.FAVORITES}`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create user");
  }
};
export const getFavorites = async (userId) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.USERS}/${userId}${API_ENDPOINTS.FAVORITES}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create user");
  }
};
