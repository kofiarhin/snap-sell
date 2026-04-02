import { api } from "../lib/api";

export const createInquiry = (data) => api.post("/inquiries", data);
export const getSellerInquiries = (params) => api.get("/inquiries/seller", { params });
export const getInquiriesByProduct = (productId, params) =>
  api.get(`/inquiries/product/${productId}`, { params });
export const getInquiryById = (id) => api.get(`/inquiries/${id}`);
export const replyToInquiry = (id, text) =>
  api.post(`/inquiries/${id}/reply`, { text });
export const closeInquiry = (id) => api.patch(`/inquiries/${id}/close`);
