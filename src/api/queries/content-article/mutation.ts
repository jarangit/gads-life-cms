import { http } from "@/api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "../key";
import type {
  ICreateContentArticlePayload,
  IUpdateContentArticlePayload,
} from "@/api/types/content-article";

const endpoint = "/admin/content-articles";

export function useCreateContentArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateContentArticlePayload) =>
      http(endpoint, {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content-articles"] });
    },
  });
}

export function useUpdateContentArticle(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: IUpdateContentArticlePayload) =>
      http(`${endpoint}/${id}`, {
        method: "PATCH",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content-articles"] });
      qc.invalidateQueries({ queryKey: qk.contentArticle(id) });
    },
  });
}

export function useDeleteContentArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      http(`${endpoint}/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: qk.contentArticle(id) });
      qc.invalidateQueries({ queryKey: ["content-articles"] });
    },
  });
}
