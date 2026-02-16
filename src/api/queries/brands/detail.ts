import { http } from "@/api/http";
import { useQuery } from "@tanstack/react-query";
import type { IBrandItem } from "@/api/types/brand";

export const useBrand = (id: string | undefined) => {
  return useQuery({
    queryKey: ["brands", id],
    queryFn: () => http<IBrandItem>(`/admin/brands/${id}`),
    enabled: !!id,
  });
};
