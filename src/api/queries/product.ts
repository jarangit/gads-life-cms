import { useQuery } from "@tanstack/react-query";
import { qk } from "./key";
import { http } from "../http";
import type { ProductItemResponse } from "../types/product";

export type ProductListResponse = {
  items: ProductItemResponse[];
  total: number;
};

export function useProducts(
  params: { status?: string; search?: string; page?: number } = {},
) {
  return useQuery({
    queryKey: qk.products(params),
    queryFn: () => http<ProductListResponse>("/admin/products"),
  });
}
