import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  FolderTree,
  Layers,
  GitBranch,
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
import type { Category } from "@/types";
import { useCategories } from "@/api/queries/category/list";

// Mock data for demo
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Laptops",
    slug: "laptops",
    description: "All laptop reviews",
    parentId: null,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Gaming Laptops",
    slug: "gaming-laptops",
    description: "Gaming laptop reviews",
    parentId: "1",
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "3",
    name: "Smartphones",
    slug: "smartphones",
    description: "Smartphone reviews",
    parentId: null,
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-01-17T10:00:00Z",
  },
  {
    id: "4",
    name: "Audio",
    slug: "audio",
    description: "Audio equipment reviews",
    parentId: null,
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
  },
];

export function CategoriesListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const deleteModal = useDeleteModal();

  const itemsPerPage = 10;

  // use query to fetch categories from API
  const { data, isLoading } = useCategories(); // Replace with actual query hook
  console.log("🚀 ~ CategoriesListPage ~ data:", data)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCategories(mockCategories);
    }, 500);
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Calculate stats
  const stats = useMemo(() => {
    const topLevel = categories.filter((c) => !c.parentId).length;
    const subCategories = categories.filter((c) => c.parentId).length;

    return [
      {
        label: "Total Categories",
        value: categories.length,
        icon: <FolderTree className="h-5 w-5" />,
        color: "blue" as const,
      },
      {
        label: "Top Level",
        value: topLevel,
        icon: <Layers className="h-5 w-5" />,
        color: "green" as const,
      },
      {
        label: "Sub-categories",
        value: subCategories,
        icon: <GitBranch className="h-5 w-5" />,
        color: "purple" as const,
      },
    ];
  }, [categories]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getParentName = (parentId: string | null | undefined) => {
    if (!parentId) return "—";
    const parent = categories.find((c) => c.id === parentId);
    return parent?.name || "—";
  };

  const handleDelete = () => {
    if (deleteModal.itemId) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteModal.itemId));
      deleteModal.closeModal();
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
                  <TableHead>Parent</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">
                          {category.name}
                        </p>
                        {category.description && (
                          <p className="text-sm text-slate-500 line-clamp-1">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-slate-600">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {getParentName(category.parentId)}
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
