import { useQuery } from "@tanstack/react-query";
import { http } from "@/api/http";
import { qk } from "../key";
import type { ReportsTopPagesResponse } from "@/api/types/report";

export interface ReportsTopPagesParams {
  from?: string;
  to?: string;
  limit?: number;
}

export function useReportsTopPages(params: ReportsTopPagesParams = {}) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
  ) as Record<string, string | number>;

  return useQuery({
    queryKey: qk.reportsTopPages(queryParams),
    queryFn: () =>
      http<ReportsTopPagesResponse>("/admin/reports/top-pages", {
        params: queryParams,
      }),
  });
}
