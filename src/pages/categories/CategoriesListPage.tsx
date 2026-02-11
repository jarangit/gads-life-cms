import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  FolderTree,
  Layers,
  CheckCircle,
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
} from "@/components/ui";
import {
  PageHeader,
  DeleteConfirmModal,
  useDeleteModal,
  StatsSummary,
} from "@/components/common";
import { useCategories } from "@/api/queries/category/list";
import { useDeleteCategory } from "@/api/queries/category/mutation";

export function CategoriesListPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const deleteModal = useDeleteModal();

  const itemsPerPage = 10;

  const { data, isLoading } = useCategories();
  const delelteCategoryMutation = useDeleteCategory();

  const categories = useMemo(() => data ?? [], [data]);

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    const searchLower = search.toLowerCase();
    return categories.filter(
      (category) =>
        category.nameEn?.toLowerCase().includes(searchLower) ||
        category.nameTh?.toLowerCase().includes(searchLower) ||
        category.slug?.toLowerCase().includes(searchLower),
    );
  }, [categories, search]);

  // Calculate stats
  const stats = useMemo(() => {
    const activeCount = categories.filter((c) => c.isActive === 1).length;
    const inactiveCount = categories.filter((c) => c.isActive !== 1).length;

    return [
      {
        label: "Total Categories",
        value: categories.length,
        icon: <FolderTree className="h-5 w-5" />,
        color: "blue" as const,
      },
      {
        label: "Active",
        value: activeCount,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "green" as const,
      },
      {
        label: "Inactive",
        value: inactiveCount,
        icon: <Layers className="h-5 w-5" />,
        color: "yellow" as const,
      },
    ];
  }, [categories]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDelete = () => {
    if (deleteModal.itemId) {
      // TODO: Implement delete mutation
      delelteCategoryMutation.mutate(deleteModal.itemId, {
        onSuccess: () => {
          deleteModal.closeModal();
        },
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage product categories"
        actions={
          <Button
            as={Link}
            to="/categories/new"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Category
          </Button>
        }
      />

      {/* Stats Summary */}
      <StatsSummary stats={stats} className="mb-6 grid-cols-3" />

      <Card>
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              className="w-full sm:w-72"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          </div>
        ) : paginatedCategories.length === 0 ? (
          <EmptyState
            icon={<FolderTree className="h-6 w-6" />}
            title="No categories found"
            description={
              search
                ? "Try adjusting your search"
                : "Get started by creating your first category"
            }
            action={
              !search && (
                <Button
                  as={Link}
                  to="/categories/new"
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Category
                </Button>
              )
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {category.heroImage ? (
                          <img
                            src={category.heroImage}
                            alt={
                              category.nameEn ||
                              category.nameTh ||
                              category.slug
                            }
                            className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                            <FolderTree className="h-4 w-4 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">
                            {category.nameEn ||
                              category.nameTh ||
                              category.slug}
                          </p>
                          {category.nameTh && category.nameEn && (
                            <p className="text-sm text-slate-500">
                              {category.nameTh}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-600">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          category.isActive === 1
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {category.isActive === 1 ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {category.orderIndex}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/categories/${category.id}/edit`}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteModal.openModal(category.id)}
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
        title="Delete Category"
        message="Are you sure you want to delete this category? Products in this category will not be deleted but will need to be reassigned."
      />
    </div>
  );
}
