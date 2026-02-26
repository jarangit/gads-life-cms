import { useQuery } from "@tanstack/react-query";
import { qk } from "../key";
import { http } from "../../http";
import type { FeedbackRequestListParams, FeedbackRequestListResponse } from "@/api/types/feedback";

export function useFeedbackRequests(params: FeedbackRequestListParams = {}) {
  const { enabled = true, ...rest } = params;
  const queryParams = Object.fromEntries(
    Object.entries(rest).filter(([, value]) => value !== undefined && value !== ""),
  ) as Record<string, string | number | boolean>;

  return useQuery({
    queryKey: qk.feedbackRequests(queryParams),
    queryFn: () =>
      http<FeedbackRequestListResponse>("/admin/feedback-requests", {
        params: queryParams,
      }),
    enabled,
  });
}
