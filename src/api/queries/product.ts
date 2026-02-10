import { useQuery } from "@tanstack/react-query";
import { qk } from "./key";
import { http } from "../http";
export type Product = {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "published";
};

export type ProductListResponse = {
  items: Product[];
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
