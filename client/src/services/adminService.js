import { api } from "../lib/api";

export const getSellers = () => api.get("/admin/sellers");
export const getSellerById = (id) => api.get(`/admin/sellers/${id}`);
export const suspendSeller = (id) => api.patch(`/admin/sellers/${id}/suspend`);
export const activateSeller = (id) => api.patch(`/admin/sellers/${id}/activate`);
export const getAdminProducts = (params) => api.get("/admin/products", { params });
export const adminUpdateProduct = (id, data) => api.put(`/admin/products/${id}`, data);
export const adminRemoveProduct = (id) => api.delete(`/admin/products/${id}`);
