import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register, login, logout, updateProfile, changePassword } from "../../services/authService";
import { setUser, clearUser } from "../../features/authSlice";

export const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (res) => {
      dispatch(setUser(res.data.data));
      queryClient.setQueryData(["auth", "me"], res.data.data);
      toast.success("Registration successful!");
      navigate("/dashboard");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Registration failed");
    },
  });
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      const user = res.data.data;
      dispatch(setUser(user));
      queryClient.setQueryData(["auth", "me"], user);
      toast.success("Login successful!");
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Login failed");
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.clear();
      toast.success("Logged out");
      navigate("/");
    },
  });
};

export const useUpdateProfile = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: (res) => {
      dispatch(setUser(res.data.data));
      queryClient.setQueryData(["auth", "me"], res.data.data);
      toast.success("Profile updated");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Update failed");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error?.message || "Password change failed");
    },
  });
};
