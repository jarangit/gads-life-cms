import { http } from "@/api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const endpoint = "/admin/products";

export interface CreateProductPayload {
  categoryId?: string | null;
  brandId?: string | null;
  name: string;
  subtitle: string;
  image?: string | null;
  overallScore: number;
  isRecommended?: boolean;
  price: number;
  currency?: string;
  priceLabel: string;
  affiliateLink?: string | null;
  lastUpdated: string;
  ratings?: { subCategory: string; score: number }[];
  status?: "draft" | "published";
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateProductPayload) =>
      http(endpoint, {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<CreateProductPayload>) =>
      http(`${endpoint}/${id}`, {
        method: "PATCH",
        body: payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", id] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      http(`${endpoint}/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
