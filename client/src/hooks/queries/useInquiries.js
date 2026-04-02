import { useQuery } from "@tanstack/react-query";
import {
  getSellerInquiries,
  getInquiriesByProduct,
  getInquiryById,
} from "../../services/inquiryService";

export const useSellerInquiries = (params = {}) => {
  return useQuery({
    queryKey: ["inquiries", "seller", params],
    queryFn: async () => {
      const res = await getSellerInquiries(params);
      return res.data.data;
    },
  });
};

export const useProductInquiries = (productId, params = {}) => {
  return useQuery({
    queryKey: ["inquiries", "product", productId, params],
    queryFn: async () => {
      const res = await getInquiriesByProduct(productId, params);
      return res.data.data;
    },
    enabled: !!productId,
  });
};

export const useInquiry = (id) => {
  return useQuery({
    queryKey: ["inquiry", id],
    queryFn: async () => {
      const res = await getInquiryById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
};
