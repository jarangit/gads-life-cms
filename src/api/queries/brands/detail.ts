import { http } from "@/api/http";
import { useQuery } from "@tanstack/react-query";
import type { IBrandItem } from "@/api/types/brand";

interface ApiResponse {
  success: boolean;
  message: string;
  data: IBrandItem;
}

export const useBrand = (id: string | undefined) => {
  return useQuery({
    queryKey: ["brands", id],
    queryFn: () => http<ApiResponse>(`/admin/brands/${id}`),
    select: (response) => response.data,
    enabled: !!id,
  });
};
