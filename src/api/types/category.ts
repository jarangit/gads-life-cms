export interface ICategoryItem {
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
