import { useQuery } from "@tanstack/react-query";
import { qk } from "../key";
import { http } from "../../http";
import type { ProductItemResponse } from "../../types/product";
// import type { ApiResponse } from "@/api/types/api";

export interface ProductListResponse {
  items: ProductItemResponse[];
  total: number;
}

export interface ProductListParams {
  status?: string;
  search?: string;
  page?: number;
  categoryId?: string;
  brandId?: string;
  enabled?: boolean;
}

export function useProducts(params: ProductListParams = {}) {
  const { enabled = true, ...rest } = params;
  const queryParams = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== undefined && v !== ""),
  ) as Record<string, string | number | boolean>;

  return useQuery({
    queryKey: qk.products(queryParams),
    queryFn: () =>
      http<ProductListResponse>("/admin/products", {
        params: queryParams,
      }),
   
  });
}
