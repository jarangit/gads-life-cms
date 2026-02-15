import { http } from "@/api/http";
import { qk } from "../key";
import { useQuery } from "@tanstack/react-query";
import type { ICategoryItem } from "@/api/types/category";

interface ApiResponse {
  items: ICategoryItem[];
  total: number;
}

export const useCategories = () => {
  return useQuery({
    queryKey: qk.categories(),
    queryFn: () => http<ApiResponse>("/admin/category"),
    select: (response) => response,
  });
};
