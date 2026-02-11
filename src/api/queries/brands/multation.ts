import { http } from "@/api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "../key";
import type { ICreateBrandPayload } from "@/api/types/brand";

const enpoint = "/admin/brands";

export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ICreateBrandPayload) =>
      http(enpoint, {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}

export function useUpdateBrand(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ICreateBrandPayload) =>
      http(`${enpoint}/${id}`, {
        method: "PATCH",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}

export function useDeleteBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      http(`${enpoint}/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: qk.product(id) });
      qc.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}
