import { http } from "@/api/http";
import { qk } from "../key";
import type { ICollectionItem } from "@/api/types/collection";
import { useQuery } from "@tanstack/react-query";

export const useCollection = (id: string | undefined) => {
  return useQuery({
    queryKey: qk.collection(id ?? ""),
    queryFn: () => http<ICollectionItem>(`/admin/collections/${id}`),
    enabled: !!id,
  });
};
