export interface ReportRange {
  from: string;
  to: string;
}

export interface ReportsOverviewSummary {
  totalEvents: number;
  pageViews: number;
  productViews: number;
  uniqueVisitors: number;
}

export interface ReportsDailyItem {
  date: string;
  total: number;
  pageViews: number;
  productViews: number;
  uniqueVisitors: number;
}

export interface ReportsOverviewResponse {
  range: ReportRange;
  summary: ReportsOverviewSummary;
  daily: ReportsDailyItem[];
}

export interface ReportsTopProductItem {
  productId: string | null;
  productSlug: string | null;
  views: number;
}

export interface ReportsTopProductsResponse {
  range: ReportRange;
  items: ReportsTopProductItem[];
}

export interface ReportsTopPageItem {
  path: string | null;
  views: number;
}

export interface ReportsTopPagesResponse {
  range: ReportRange;
  items: ReportsTopPageItem[];
}
