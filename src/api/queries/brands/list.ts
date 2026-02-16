import { http } from "@/api/http";
import { qk } from "../key";
import type { IBrandItem } from "@/api/types/brand";
import { useQuery } from "@tanstack/react-query";

interface ApiResponse {
  items: IBrandItem[];
  total: number;
}

export const useBrands = () => {
  return useQuery({
    queryKey: qk.brands(),
    queryFn: () => http<ApiResponse>("/admin/brands"),
    select: (response) => response.items,
  });
};
