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
