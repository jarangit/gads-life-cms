import { useQuery } from "@tanstack/react-query";
import { qk } from "../key";
import type { ProductItemResponse } from "@/api/types/product";
import { http } from "@/api/http";

export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: qk.product(id),
    queryFn: () => http<ProductItemResponse>(`/admin/products/${id}`),
  });
};
