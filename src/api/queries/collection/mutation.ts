import { http } from "@/api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "../key";
import type {
  ICreateCollectionPayload,
  IUpdateCollectionPayload,
} from "@/api/types/collection";

const endpoint = "/admin/collections";

export function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ICreateCollectionPayload) =>
      http(endpoint, {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["collections"] });
    },
  });
}

export function useUpdateCollection(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: IUpdateCollectionPayload) =>
      http(`${endpoint}/${id}`, {
        method: "PATCH",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["collections"] });
      qc.invalidateQueries({ queryKey: qk.collection(id) });
    },
  });
}

export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      http(`${endpoint}/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: qk.collection(id) });
      qc.invalidateQueries({ queryKey: ["collections"] });
    },
  });
}
