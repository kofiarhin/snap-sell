import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  markProductSold,
  archiveProduct,
  reactivateProduct,
} from "../../services/productService";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created!");
      navigate("/dashboard/listings");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to create product");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to update product");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to delete product");
    },
  });
};

export const useMarkSold = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markProductSold,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Product marked as sold");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to mark as sold");
    },
  });
};

export const useArchiveProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product archived");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to archive product");
    },
  });
};

export const useReactivateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactivateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product reactivated");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to reactivate product");
    },
  });
};
