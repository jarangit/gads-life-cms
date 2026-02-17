export type CollectionType = "TOP_LIST" | "GUIDE" | "COMPARISON";
export type CollectionStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ICollectionItem {
  id: string;
  type: CollectionType;
  slug: string;
  titleTh: string;
  titleEn: string | null;
  excerpt: string | null;
  coverImage: string | null;
  categoryId: string | null;
  status: CollectionStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    slug: string;
    nameTh: string | null;
    nameEn: string | null;
  } | null;
  items?: ICollectionItemProduct[];
}

export interface ICollectionItemProduct {
  id: string;
  collectionId: string;
  productId: string;
  orderIndex: number;
  originalPrice: number | null;
  dealPrice: number | null;
  currency: string;
  dealStartAt: string | null;
  dealEndAt: string | null;
  dealBadge: string | null;
  dealUrl: string | null;
  note: string | null;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    subtitle: string;
    price: number;
    currency: string;
  };
}

export interface ICreateCollectionItemPayload {
  collectionId: string;
  productId: string;
  orderIndex?: number;
  originalPrice?: number | null;
  dealPrice?: number | null;
  currency?: string;
  dealStartAt?: string | null;
  dealEndAt?: string | null;
  dealBadge?: string | null;
  dealUrl?: string | null;
  note?: string | null;
}

export interface IUpdateCollectionItemPayload {
  orderIndex?: number;
  originalPrice?: number | null;
  dealPrice?: number | null;
  currency?: string;
  dealStartAt?: string | null;
  dealEndAt?: string | null;
  dealBadge?: string | null;
  dealUrl?: string | null;
  note?: string | null;
}

export interface ICreateCollectionPayload {
  type: CollectionType;
  slug: string;
  titleTh: string;
  titleEn?: string;
  excerpt?: string;
  coverImage?: string;
  categoryId?: string;
}

export interface IUpdateCollectionPayload {
  type?: CollectionType;
  slug?: string;
  titleTh?: string;
  titleEn?: string;
  excerpt?: string;
  coverImage?: string;
  categoryId?: string;
  status?: CollectionStatus;
}
