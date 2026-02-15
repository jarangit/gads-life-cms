import { useQuery } from "@tanstack/react-query";
import { qk } from "../key";
import { http } from "../../http";
import type { ProductItemResponse } from "../../types/product";
import type { ApiResponse } from "@/api/types/api";

export interface ProductListResponse {
  items: ProductItemResponse[];
  total: number;
}

export interface ProductListParams {
  status?: string;
  search?: string;
  page?: number;
}

export function useProducts(params: ProductListParams = {}) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>;

  return useQuery({
    queryKey: qk.products(queryParams),
    queryFn: () =>
      http<ApiResponse<ProductListResponse>>("/admin/products", {
        // params: {
        //   status: params.status,
        //   search: params.search,
        //   page: params.page,
        // },
      }),
    select: (response) => response,
  });
}
