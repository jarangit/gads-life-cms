import { useQuery } from "@tanstack/react-query";
import { http } from "@/api/http";
import { qk } from "../key";
import type { ReportsTopProductsResponse } from "@/api/types/report";

export interface ReportsTopProductsParams {
  from?: string;
  to?: string;
  limit?: number;
}

export function useReportsTopProducts(params: ReportsTopProductsParams = {}) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
  ) as Record<string, string | number>;

  return useQuery({
    queryKey: qk.reportsTopProducts(queryParams),
    queryFn: () =>
      http<ReportsTopProductsResponse>("/admin/reports/top-products", {
        params: queryParams,
      }),
  });
}
