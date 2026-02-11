import { http } from "@/api/http";
import { qk } from "../key";
import type { IBrandItem } from "@/api/types/brand";
import { useQuery } from "@tanstack/react-query";

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    items: IBrandItem[];
  };
}

export const useBrands = () => {
  return useQuery({
    queryKey: qk.brands(),
    queryFn: () => http<ApiResponse>("/admin/brands"),
    select: (response) => response.data.items,
  });
};
