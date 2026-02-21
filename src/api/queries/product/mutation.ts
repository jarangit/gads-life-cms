import { http } from "@/api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const endpoint = "/admin/products";

export interface CreateProductPayload {
  categoryId?: string | null;
  brandId?: string | null;
  slug?: string;
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
  keyHighlights?: { content: string; sortOrder?: number }[];
  weaknesses?: { content: string; sortOrder?: number }[];
  beforePurchasePoints?: { content: string; sortOrder?: number }[];
  afterUsagePoints?: { content: string; sortOrder?: number }[];
  pros?: { content: string; sortOrder?: number }[];
  cons?: { content: string; sortOrder?: number }[];
  quickVerdict?: { quote: string; description: string } | null;
  quickVerdictTags?: { tag: string; sortOrder?: number }[];
  pricing?: { price: number; currency?: string; priceLabel: string } | null;
  finalVerdictPoints?: {
    type: "BUY_IF" | "SKIP_IF";
    text: string;
    orderIndex?: number;
  }[];
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      return http(endpoint, {
        method: "POST",
        body: payload,
      });
    },
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
