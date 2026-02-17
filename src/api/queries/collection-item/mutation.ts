import { http } from "@/api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "../key";
import type {
  ICreateCollectionItemPayload,
  IUpdateCollectionItemPayload,
  ICollectionItemProduct,
} from "@/api/types/collection";

const endpoint = "/admin/collection-items";

export function useCreateCollectionItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ICreateCollectionItemPayload) =>
      http<ICollectionItemProduct>(endpoint, {
        method: "POST",
        body: payload,
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: qk.collection(variables.collectionId),
      });
    },
  });
}

export function useUpdateCollectionItem(collectionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateCollectionItemPayload;
    }) =>
      http<ICollectionItemProduct>(`${endpoint}/${id}`, {
        method: "PATCH",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.collection(collectionId) });
    },
  });
}

export function useDeleteCollectionItem(collectionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      http(`${endpoint}/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.collection(collectionId) });
    },
  });
}
