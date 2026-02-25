export type ContentType = "NEWS" | "REVIEW" | "GUIDE" | "COMPARISON";
export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface IContentSection {
  id: string;
  articleId: string;
  heading: string | null;
  body: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface IContentTag {
  id: string;
  articleId: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface IContentArticleListItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  excerpt: string | null;
  type: ContentType;
  status: ContentStatus;
  publishedAt: string | null;
  isFeatured: number;
  metaTitle: string | null;
  metaDescription: string | null;
  heroImage: string | null;
  heroImageAlt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IContentArticleDetail extends IContentArticleListItem {
  sections: IContentSection[];
  tags: IContentTag[];
}

// --- Section DTO ---
export interface IContentSectionPayload {
  heading?: string | null;
  body: string;
  sortOrder?: number;
}

// --- Tag DTO ---
export interface IContentTagPayload {
  value: string;
}

// --- Create payload ---
export interface ICreateContentArticlePayload {
  slug: string;
  title: string;
  summary?: string | null;
  excerpt?: string | null;
  type: ContentType;
  status?: ContentStatus;
  publishedAt?: string | null;
  isFeatured?: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  heroImage?: string | null;
  heroImageAlt?: string | null;
  sections?: IContentSectionPayload[];
  tags?: IContentTagPayload[];
}

// --- Update payload ---
export interface IUpdateContentArticlePayload
  extends Partial<ICreateContentArticlePayload> {
  sections?: IContentSectionPayload[];
  tags?: IContentTagPayload[];
}
