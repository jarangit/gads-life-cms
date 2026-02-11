export interface IBrandItem {
  id: string;
  name: string;
  slug: string;
  tagline: null;
  description: null;
  logoUrl: null;
  ogImageUrl: null;
  metaTitle: null;
  metaDescription: null;
  canonicalUrl: null;
  isIndexable: boolean;
  isFollowable: boolean;
  schemaJsonLd: null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateBrandPayload {
  id?: string;
  name: string;
  slug: string;
  tagline?: null;
  description?: null;
  logoUrl?: null;
  ogImageUrl?: null;
  metaTitle?: null;
  metaDescription?: null;
  canonicalUrl?: null;
  isIndexable?: boolean;
  isFollowable?: boolean;
  schemaJsonLd?: null;
}
