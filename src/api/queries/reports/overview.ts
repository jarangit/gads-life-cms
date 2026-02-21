import { useQuery } from "@tanstack/react-query";
import { http } from "@/api/http";
import { qk } from "../key";
import type { ReportsOverviewResponse } from "@/api/types/report";

export interface ReportsOverviewParams {
  from?: string;
  to?: string;
}

export function useReportsOverview(params: ReportsOverviewParams = {}) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
  ) as Record<string, string>;

  return useQuery({
    queryKey: qk.reportsOverview(queryParams),
    queryFn: () =>
      http<ReportsOverviewResponse>("/admin/reports/overview", {
        params: queryParams,
      }),
  });
}
