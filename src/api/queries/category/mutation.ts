import { http } from "@/api/http";
import type { ICreateCategoryPayload } from "@/api/types/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "../key";

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ICreateCategoryPayload) =>
      http("/admin/category", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ICreateCategoryPayload) =>
      http(`/admin/category/${id}`, {
        method: "PUT",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      http(`/admin/category/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: qk.product(id) });
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
