import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  getProductBySlug,
  getMyProducts,
  getSellerPublicProducts,
} from "../../services/productService";

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await getProducts(params);
      return res.data.data;
    },
  });
};

export const useProduct = (slug) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await getProductBySlug(slug);
      return res.data.data;
    },
    enabled: !!slug,
  });
};

export const useMyProducts = () => {
  return useQuery({
    queryKey: ["products", "mine"],
    queryFn: async () => {
      const res = await getMyProducts();
      return res.data.data;
    },
  });
};

export const useSellerPublicProducts = (sellerId) => {
  return useQuery({
    queryKey: ["products", "seller", sellerId],
    queryFn: async () => {
      const res = await getSellerPublicProducts(sellerId);
      return res.data.data;
    },
    enabled: !!sellerId,
  });
};
