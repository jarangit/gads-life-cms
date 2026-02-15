import { useQuery } from "@tanstack/react-query";
import { qk } from "../key";
import type { ProductItemResponse } from "@/api/types/product";
import { http } from "@/api/http";

interface DetailApiResponse {
  data: ProductItemResponse;
}

export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: qk.product(id),
    queryFn: () => http<DetailApiResponse>(`/admin/products/${id}`),
    select: (response) => response,
    enabled: !!id,
  });
};
