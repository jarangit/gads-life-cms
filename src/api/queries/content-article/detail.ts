import { http } from "@/api/http";
import { qk } from "../key";
import type { IContentArticleDetail } from "@/api/types/content-article";
import { useQuery } from "@tanstack/react-query";

export const useContentArticle = (id?: string) => {
  return useQuery({
    queryKey: qk.contentArticle(id ?? ""),
    queryFn: () => http<IContentArticleDetail>(`/admin/content-articles/${id}`),
    enabled: Boolean(id),
  });
};
