import { useMemo, useState } from "react";
import { MessageSquareWarning, Search } from "lucide-react";
import {
  Badge,
  Card,
  EmptyState,
  Pagination,
  SearchInput,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { PageHeader, StatsSummary } from "@/components/common";
import { useFeedbackRequests } from "@/api/queries/feedback/list";
import { useUpdateFeedbackRequest } from "@/api/queries/feedback/mutation";
import type {
  FeedbackRequestItem,
  FeedbackRequestStatus,
  FeedbackRequestType,
} from "@/api/types/feedback";

const statusOptions: Array<{ value: "" | FeedbackRequestStatus; label: string }> = [
  { value: "", label: "All Status" },
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const typeOptions: Array<{ value: "" | FeedbackRequestType; label: string }> = [
  { value: "", label: "All Type" },
  { value: "ISSUE", label: "Issue" },
  { value: "WRONG_INFORMATION", label: "Wrong Information" },
  { value: "MORE_INFORMATION", label: "More Information" },
];

const statusBadgeVariant: Record<
  FeedbackRequestStatus,
  "default" | "info" | "success" | "warning"
> = {
  NEW: "warning",
  IN_PROGRESS: "info",
  RESOLVED: "success",
  CLOSED: "default",
};

function formatType(type: FeedbackRequestType) {
  switch (type) {
    case "ISSUE":
      return "Issue";
    case "WRONG_INFORMATION":
      return "Wrong Information";
    case "MORE_INFORMATION":
      return "More Information";
    default:
      return type;
  }
}

function formatStatus(status: FeedbackRequestStatus) {
  switch (status) {
    case "NEW":
      return "New";
    case "IN_PROGRESS":
      return "In Progress";
    case "RESOLVED":
      return "Resolved";
    case "CLOSED":
      return "Closed";
    default:
      return status;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function FeedbackStatusBadge({ status }: { status: FeedbackRequestStatus }) {
  return <Badge variant={statusBadgeVariant[status]}>{formatStatus(status)}</Badge>;
}

function FeedbackRowInfo({ feedback }: { feedback: FeedbackRequestItem }) {
  return (
    <div className="space-y-1">
      <p className="font-medium text-slate-900">{feedback.subject || "No subject"}</p>
      <p className="line-clamp-2 text-sm text-slate-600">{feedback.message}</p>
      {feedback.pageUrl && (
        <a
          href={feedback.pageUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          {feedback.pageUrl}
        </a>
      )}
    </div>
  );
}

export function FeedbackRequestsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | FeedbackRequestStatus>("");
  const [typeFilter, setTypeFilter] = useState<"" | FeedbackRequestType>("");
  const [currentPage, setCurrentPage] = useState(1);

  const updateFeedbackRequest = useUpdateFeedbackRequest();

  const { data, isLoading } = useFeedbackRequests({
    page: currentPage,
    limit: 10,
    search: search || undefined,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
  });

  const feedbackItems = useMemo(() => data?.items ?? [], [data?.items]);
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const stats = useMemo(() => {
    const counts = feedbackItems.reduce(
      (acc, item) => {
        acc[item.status] += 1;
        return acc;
      },
      {
        NEW: 0,
        IN_PROGRESS: 0,
        RESOLVED: 0,
        CLOSED: 0,
      } satisfies Record<FeedbackRequestStatus, number>,
    );

    return [
      {
        label: "Total",
        value: total,
        icon: <MessageSquareWarning className="h-5 w-5" />,
        color: "blue" as const,
      },
      {
        label: "New",
        value: counts.NEW,
        icon: <Search className="h-5 w-5" />,
        color: "yellow" as const,
      },
      {
        label: "In Progress",
        value: counts.IN_PROGRESS,
        icon: <Search className="h-5 w-5" />,
        color: "purple" as const,
      },
      {
        label: "Resolved/Closed",
        value: counts.RESOLVED + counts.CLOSED,
        icon: <Search className="h-5 w-5" />,
        color: "green" as const,
      },
    ];
  }, [feedbackItems, total]);

  return (
    <div>
      <PageHeader
        title="Feedback Requests"
        description="Review and update feedback from website visitors"
      />

      <StatsSummary stats={stats} className="mb-6 grid-cols-2 lg:grid-cols-4" />

      <Card>
        <div className="space-y-3 border-b border-slate-200 p-4">
          <SearchInput
            placeholder="Search by name, email, subject, or message..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            onClear={() => {
              setSearch("");
              setCurrentPage(1);
            }}
            className="w-full"
          />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Select
              options={typeOptions}
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as "" | FeedbackRequestType);
                setCurrentPage(1);
              }}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "" | FeedbackRequestStatus);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          </div>
        ) : feedbackItems.length === 0 ? (
          <EmptyState
            icon={<MessageSquareWarning className="h-6 w-6" />}
            title="No feedback requests found"
            description="Try adjusting your filters or search keyword"
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbackItems.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>
                      <span className="text-sm font-medium text-slate-700">{formatType(feedback.type)}</span>
                    </TableCell>
                    <TableCell>
                      <FeedbackRowInfo feedback={feedback} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm text-slate-600">
                        <p>{feedback.name || "Anonymous"}</p>
                        <p className="text-xs text-slate-500">{feedback.email || "No email"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <FeedbackStatusBadge status={feedback.status} />
                        <Select
                          options={statusOptions.filter((item) => item.value !== "") as { value: string; label: string }[]}
                          value={feedback.status}
                          onChange={(e) => {
                            const nextStatus = e.target.value as FeedbackRequestStatus;
                            if (nextStatus === feedback.status) return;

                            updateFeedbackRequest.mutate({
                              id: feedback.id,
                              payload: { status: nextStatus },
                            });
                          }}
                          disabled={updateFeedbackRequest.isPending}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{formatDate(feedback.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="border-t border-slate-200 px-4 py-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
