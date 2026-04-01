import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getMe } from "../../services/authService";
import { setUser, clearUser } from "../../features/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await getMe();
      return res.data.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setUser(query.data));
    } else if (query.isError) {
      dispatch(clearUser());
    }
  }, [query.data, query.isError, dispatch]);

  return query;
};
