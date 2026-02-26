export type FeedbackRequestType =
  | "ISSUE"
  | "WRONG_INFORMATION"
  | "MORE_INFORMATION";

export type FeedbackRequestStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface FeedbackRequestItem {
  id: string;
  type: FeedbackRequestType;
  name?: string | null;
  email?: string | null;
  subject?: string | null;
  message: string;
  pageUrl?: string | null;
  status: FeedbackRequestStatus;
  adminNote?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackRequestListResponse {
  items: FeedbackRequestItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FeedbackRequestListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: FeedbackRequestType;
  status?: FeedbackRequestStatus;
  enabled?: boolean;
}

export interface UpdateFeedbackRequestPayload {
  status?: FeedbackRequestStatus;
  adminNote?: string;
}
