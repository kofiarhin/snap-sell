import { api } from "../lib/api";

export const createInquiry = (data) => api.post("/inquiries", data);
export const getSellerInquiries = () => api.get("/inquiries/seller");
export const getInquiriesByProduct = (productId) =>
  api.get(`/inquiries/product/${productId}`);
export const getInquiryById = (id) => api.get(`/inquiries/${id}`);
export const replyToInquiry = (id, text) =>
  api.post(`/inquiries/${id}/reply`, { text });
export const closeInquiry = (id) => api.patch(`/inquiries/${id}/close`);
