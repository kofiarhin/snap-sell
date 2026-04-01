import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  suspendSeller,
  activateSeller,
  adminUpdateProduct,
  adminRemoveProduct,
} from "../../services/adminService";

export const useSuspendSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suspendSeller,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
      toast.success("Seller suspended");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to suspend seller");
    },
  });
};

export const useActivateSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateSeller,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
      toast.success("Seller activated");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to activate seller");
    },
  });
};

export const useAdminUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminUpdateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product updated");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to update product");
    },
  });
};

export const useAdminRemoveProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminRemoveProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product removed");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to remove product");
    },
  });
};
