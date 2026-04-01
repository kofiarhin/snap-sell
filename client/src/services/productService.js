import { api } from "../lib/api";

export const getProducts = (params) => api.get("/products", { params });
export const getProductBySlug = (slug) => api.get(`/products/${slug}`);
export const getSellerPublicProducts = (sellerId) =>
  api.get(`/products/seller/${sellerId}/public`);
export const getMyProducts = () => api.get("/products/seller/me");
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const markProductSold = (id) => api.patch(`/products/${id}/sold`);
export const archiveProduct = (id) => api.patch(`/products/${id}/archive`);
export const reactivateProduct = (id) => api.patch(`/products/${id}/reactivate`);
