import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  CheckCircle,
  Archive,
} from "lucide-react";
import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SearchInput,
  Pagination,
  EmptyState,
  Card,
  Badge,
  Select,
} from "@/components/ui";
import {
  PageHeader,
  DeleteConfirmModal,
  useDeleteModal,
  StatsSummary,
} from "@/components/common";
import { useContentArticles } from "@/api/queries/content-article/list";
import { useDeleteContentArticle } from "@/api/queries/content-article/mutation";
import type {
  ContentType,
  ContentStatus,
} from "@/api/types/content-article";

const typeLabels: Record<ContentType, string> = {
  NEWS: "News",
  REVIEW: "Review",
  GUIDE: "Guide",
  COMPARISON: "Comparison",
};

const typeBadgeColors: Record<
  ContentType,
  "default" | "info" | "success" | "warning"
> = {
  NEWS: "info",
  REVIEW: "success",
  GUIDE: "default",
  COMPARISON: "warning",
};

const statusLabels: Record<ContentStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

const statusBadgeColors: Record<
  ContentStatus,
  "default" | "success" | "warning"
> = {
  DRAFT: "default",
  PUBLISHED: "success",
  ARCHIVED: "warning",
};

const statusFilterOptions = [
  { value: "", label: "All Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

const typeFilterOptions = [
  { value: "", label: "All Types" },
  { value: "NEWS", label: "News" },
  { value: "REVIEW", label: "Review" },
  { value: "GUIDE", label: "Guide" },
  { value: "COMPARISON", label: "Comparison" },
];

export function ContentArticlesListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<ContentType | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const deleteModal = useDeleteModal();

  const { data: articles = { items: [] }, isLoading } = useContentArticles();
  console.log("🚀 ~ ContentArticlesListPage ~ articles:", articles)
  const deleteArticle = useDeleteContentArticle();
  console.log("🚀 ~ ContentArticlesListPage ~ deleteArticle:", deleteArticle)

  const itemsPerPage = 10;

  const filteredArticles = articles.items.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || article.status === statusFilter;
    const matchesType = !typeFilter || article.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = useMemo(() => {
    const published = articles.items.filter((a) => a.status === "PUBLISHED").length;
    const draft = articles.items.filter((a) => a.status === "DRAFT").length;
    const archived = articles.items.filter((a) => a.status === "ARCHIVED").length;
    return [
      {
        label: "Total Articles",
        value: articles.items.length,
        icon: <FileText className="h-5 w-5" />,
        color: "blue" as const,
      },
      {
        label: "Published",
        value: published,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "green" as const,
      },
      {
        label: "Draft",
        value: draft,
        icon: <FileText className="h-5 w-5" />,
        color: "yellow" as const,
      },
      {
        label: "Archived",
        value: archived,
        icon: <Archive className="h-5 w-5" />,
        color: "purple" as const,
      },
    ];
  }, [articles]);

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDelete = () => {
    if (deleteModal.itemId) {
      deleteArticle.mutate(deleteModal.itemId, {
        onSuccess: () => {
          deleteModal.closeModal();
        },
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="Content Articles"
        description="Manage news, reviews, guides and comparisons"
        actions={
          <Button
            as={Link}
            to="/content-articles/new"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Article
          </Button>
        }
      />

      <StatsSummary stats={stats} className="mb-6 grid-cols-4" />

      <Card>
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              className="w-full sm:w-72"
            />
            <div className="flex gap-2">
              <Select
                options={typeFilterOptions}
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as ContentType | "")
                }
                className="w-full sm:w-40"
              />
              <Select
                options={statusFilterOptions}
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ContentStatus | "")
                }
                className="w-full sm:w-40"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          </div>
        ) : paginatedArticles.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="No articles found"
            description={
              search || statusFilter || typeFilter
                ? "Try adjusting your filters"
                : "Get started by creating your first article"
            }
            action={
              !search &&
              !statusFilter &&
              !typeFilter && (
                <Button
                  as={Link}
                  to="/content-articles/new"
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Article
                </Button>
              )
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Published At</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">
                          {article.title}
                        </p>
                        {article.excerpt && (
                          <p className="line-clamp-1 text-sm text-slate-500">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-600">
                        {article.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={typeBadgeColors[article.type]}>
                        {typeLabels[article.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeColors[article.status]}>
                        {statusLabels[article.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {article.isFeatured ? (
                        <Badge variant="success">Yes</Badge>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString(
                            "th-TH",
                          )
                        : <span className="text-slate-400">—</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/content-articles/${article.id}/edit`}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteModal.openModal(article.id)}
                          className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
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

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDelete}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
      />
    </div>
  );
}
