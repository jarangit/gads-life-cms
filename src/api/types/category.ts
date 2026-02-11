export interface ICategoryItem {
  id: string;
  slug: string;
  nameTh: string | null;
  nameEn: string | null;
  description: string | null;
  heroImage: string | null;
  isActive: number;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCategoryPayload {
  id?: string;
  slug: string;
  nameTh: string;
  nameEn?: null;
  description?: null;
  heroImage?: null;
  isActive?: boolean;
  orderIndex?: number;
}
