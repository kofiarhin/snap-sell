import { useQuery } from "@tanstack/react-query";
import {
  getSellerInquiries,
  getInquiriesByProduct,
  getInquiryById,
} from "../../services/inquiryService";

export const useSellerInquiries = () => {
  return useQuery({
    queryKey: ["inquiries", "seller"],
    queryFn: async () => {
      const res = await getSellerInquiries();
      return res.data.data;
    },
  });
};

export const useProductInquiries = (productId) => {
  return useQuery({
    queryKey: ["inquiries", "product", productId],
    queryFn: async () => {
      const res = await getInquiriesByProduct(productId);
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
