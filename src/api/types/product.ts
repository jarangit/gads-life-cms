export interface ProductItemResponse {
  id: string;
  categoryId: string | null;
  brandId: string | null;
  category: Category | null;
  brand: Brand | null;
  name: string;
  subtitle: string;
  image: string | null;
  overallScore: string;
  isRecommended: boolean;
  price: number;
  currency: string;
  priceLabel: string;
  affiliateLink: string | null;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
  ratings: Rating[];
  status: string;
  keyHighlights: SortedContentItem[];
  weaknesses: SortedContentItem[];
  beforePurchasePoints: SortedContentItem[];
  afterUsagePoints: SortedContentItem[];
  pros: SortedContentItem[];
  cons: SortedContentItem[];
  quickVerdict: QuickVerdict | null;
  quickVerdictTags: QuickVerdictTag[];
  pricing: ProductPricing | null;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  slug: string;
  nameTh: string;
  nameEn: string;
  description: string;
  heroImage: string;
  isActive: number;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rating {
  id: number;
  productId: string;
  subCategory: string;
  score: number;
}

export interface SortedContentItem {
  id: number;
  productId: string;
  content: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuickVerdict {
  id: number;
  productId: string;
  quote: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuickVerdictTag {
  id: number;
  productId: string;
  tag: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductPricing {
  id: number;
  productId: string;
  price: number;
  currency: string;
  priceLabel: string;
  createdAt: Date;
  updatedAt: Date;
}
