export const qk = {
  products: (params?: Record<string, string | number | boolean>) =>
    ["products", params ?? {}] as const,
  product: (id: string) => ["product", id] as const,

  categories: () => ["categories"] as const,
  brands: () => ["brands"] as const,

  collections: (params?: Record<string, string | number | boolean>) =>
    ["collections", params ?? {}] as const,
  collection: (id: string) => ["collection", id] as const,

  collectionItems: (collectionId: string) =>
    ["collection-items", collectionId] as const,
};
