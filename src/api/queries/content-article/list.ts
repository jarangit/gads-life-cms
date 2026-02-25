import { http } from "@/api/http";
import { qk } from "../key";
import type { IContentArticleListItem } from "@/api/types/content-article";
import type { ContentType, ContentStatus } from "@/api/types/content-article";
import { useQuery } from "@tanstack/react-query";

export interface ContentArticlesQueryParams {
  type?: ContentType;
  status?: ContentStatus;
  isFeatured?: number;
}
interface ContentArticlesResponse {
  items: IContentArticleListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useContentArticles = (params?: ContentArticlesQueryParams) => {
  return useQuery({
    queryKey: qk.contentArticles(
      params as Record<string, string | number | boolean> | undefined,
    ),
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params?.type) searchParams.set("type", params.type);
      if (params?.status) searchParams.set("status", params.status);
      if (params?.isFeatured !== undefined)
        searchParams.set("isFeatured", String(params.isFeatured));
      const qs = searchParams.toString();
      return http<ContentArticlesResponse>(
        `/admin/content-articles${qs ? `?${qs}` : ""}`,
      );
    },
  });
};
