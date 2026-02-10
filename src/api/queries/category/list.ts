import { http } from "@/api/http";
import { qk } from "../key";
import type { ICategoryItem } from "@/api/types/category";
import type { ApiResponse } from "@/api/types/api";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery({
    queryKey: qk.categories(),
    queryFn: () => http<ApiResponse<ICategoryItem[]>>("/admin/category"),
    select: (response) => response.data,
  });
};
