import { api } from "../lib/api";

export const getCategories = () => api.get("/categories");
