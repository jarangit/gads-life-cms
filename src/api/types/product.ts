export interface ProductItemResponse {
  id: string;
  categoryId: string;
  category: Category;
  name: string;
  subtitle: string;
  image: null;
  overallScore: string;
  isRecommended: boolean;
  price: number;
  currency: string;
  priceLabel: string;
  affiliateLink: null;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
  ratings: Rating[];
  status: string;
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
