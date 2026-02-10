import { http } from "@/api/http";
import { qk } from "../key";
import type { ICategoryItem } from "@/api/types/category";
import { useQuery } from "@tanstack/react-query";

interface CategoryListResponse {
  items: ICategoryItem[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: CategoryListResponse;
}

export const useCategories = () => {
  return useQuery({
    queryKey: qk.categories(),
    queryFn: () => http<ApiResponse>("/admin/category"),
    select: (response) => response.data.items,
  });
};
