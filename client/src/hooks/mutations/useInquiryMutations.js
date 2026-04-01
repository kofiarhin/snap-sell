import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createInquiry, replyToInquiry, closeInquiry } from "../../services/inquiryService";

export const useCreateInquiry = () => {
  return useMutation({
    mutationFn: createInquiry,
    onSuccess: () => {
      toast.success("Inquiry sent! The seller will get back to you.");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to send inquiry");
    },
  });
};

export const useReplyToInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, text }) => replyToInquiry(id, text),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inquiry", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Reply sent");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to send reply");
    },
  });
};

export const useCloseInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Inquiry closed");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Failed to close inquiry");
    },
  });
};
