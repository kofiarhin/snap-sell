import { useQuery } from "@tanstack/react-query";
import { getSellers, getSellerById, getAdminProducts } from "../../services/adminService";

export const useAdminSellers = () => {
  return useQuery({
    queryKey: ["admin", "sellers"],
    queryFn: async () => {
      const res = await getSellers();
      return res.data.data;
    },
  });
};

export const useAdminSeller = (id) => {
  return useQuery({
    queryKey: ["admin", "seller", id],
    queryFn: async () => {
      const res = await getSellerById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useAdminProducts = (params = {}) => {
  return useQuery({
    queryKey: ["admin", "products", params],
    queryFn: async () => {
      const res = await getAdminProducts(params);
      return res.data.data;
    },
  });
};
