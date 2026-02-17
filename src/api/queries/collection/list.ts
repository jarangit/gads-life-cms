import { http } from "@/api/http";
import { qk } from "../key";
import type { ICollectionItem } from "@/api/types/collection";
import { useQuery } from "@tanstack/react-query";

export const useCollections = () => {
  return useQuery({
    queryKey: qk.collections(),
    queryFn: () => http<ICollectionItem[]>("/admin/collections"),
  });
};
