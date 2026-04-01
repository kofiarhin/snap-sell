import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/categoryService";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 30,
  });
};
