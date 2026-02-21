import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Eye,
  Send,
  FileText,
  CheckCircle,
  ThumbsUp,
  SlidersHorizontal,
  X,
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
  Select,
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from "@/components/ui";
import {
  PageHeader,
  StatusBadge,
  DeleteConfirmModal,
  useDeleteModal,
  StatsSummary,
} from "@/components/common";
import type { ContentStatus } from "@/types";
import { useProducts } from "@/api/queries/product/product";
import { useDeleteProduct } from "@/api/queries/product/mutation";
import { useCategories } from "@/api/queries/category/list";
import { useBrands } from "@/api/queries/brands/list";
import type { ProductItemResponse } from "@/api/types/product";

export function ProductsListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "">("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const deleteModal = useDeleteModal();
  const deleteProduct = useDeleteProduct();

  const itemsPerPage = 10;

  const { data: categoriesData } = useCategories();
  const brandsData = useBrands();

  const { data, isLoading } = useProducts({
    search,
    status: statusFilter || undefined,
    categoryId: categoryFilter || undefined,
    brandId: brandFilter || undefined,
    page: currentPage,
  });

  const products = useMemo(() => data?.items ?? [], [data?.items]);
  const total = data?.total ?? 0;

  // Filter products client-side (if API doesn't support filtering)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.nameEn?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const published = products.filter((p) => p.status === "published").length;
    const draft = products.filter((p) => p.status === "draft").length;
    const recommended = products.filter((p) => p.isRecommended).length;

    return [
      {
        label: "Total Products",
        value: total,
        icon: <Package className="h-5 w-5" />,
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
        label: "Recommended",
        value: recommended,
        icon: <ThumbsUp className="h-5 w-5" />,
        color: "purple" as const,
      },
    ];
  }, [products, total]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDelete = () => {
    if (deleteModal.itemId) {
      deleteProduct.mutate(deleteModal.itemId, {
        onSuccess: () => {
          deleteModal.closeModal();
        },
      });
    }
  };

  const handleStatusChange = (productId: string, newStatus: ContentStatus) => {
    // TODO: Implement status change mutation
    void productId;
    void newStatus;
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
  ];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...(categoriesData?.items ?? []).map((c) => ({
      value: c.id,
      label: c.nameEn || c.nameTh || c.slug,
    })),
  ];

  const brandOptions = [
    { value: "", label: "All Brands" },
    ...(brandsData.data ?? []).map((b) => ({
      value: b.id,
      label: b.name,
    })),
  ];

  const hasActiveFilters = !!(categoryFilter || brandFilter || statusFilter);

  const handleClearFilters = () => {
    setCategoryFilter("");
    setBrandFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const activeFilterCount = [categoryFilter, brandFilter, statusFilter].filter(
    Boolean,
  ).length;

  const formatPrice = (product: ProductItemResponse) => {
    if (!product.price) return "—";
    return (
      product.priceLabel ||
      `${product.currency} ${product.price.toLocaleString()}`
    );
  };

  const getOverallScore = (product: ProductItemResponse) => {
    const score = parseFloat(product.overallScore);
    if (isNaN(score)) return null;
    return score;
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage product reviews"
        actions={
          <Button
            as={Link}
            to="/products/new"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Product
          </Button>
        }
      />

      {/* Stats Summary */}
      <StatsSummary stats={stats} className="mb-6 grid-cols-2 lg:grid-cols-4" />

      <Card>
        <div className="border-b border-slate-200 p-4 space-y-3">
          {/* Search */}
          <SearchInput
            placeholder="Search products..."
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

          {/* Filter row */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>
                  Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
                </span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-3 w-3" />
                  Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Select
                options={categoryOptions}
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <Select
                options={brandOptions}
                value={brandFilter}
                onChange={(e) => {
                  setBrandFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as ContentStatus | "");
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          </div>
        ) : paginatedProducts.length === 0 ? (
          <EmptyState
            icon={<Package className="h-6 w-6" />}
            title="No products found"
            description={
              search || statusFilter || categoryFilter || brandFilter
                ? "Try adjusting your filters"
                : "Get started by adding your first product"
            }
            action={
              !search &&
              !statusFilter &&
              !categoryFilter &&
              !brandFilter && (
                <Button
                  as={Link}
                  to="/products/new"
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Product
                </Button>
              )
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => {
                  const score = getOverallScore(product);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                              <Package className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-900">
                                {product.name}
                              </p>
                              {product.isRecommended && (
                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                                  <ThumbsUp className="mr-1 h-3 w-3" />
                                  Recommended
                                </span>
                              )}
                            </div>
                            {product.slug && (
                              <p className="text-xs text-slate-400 font-mono">
                                /{product.slug}
                              </p>
                            )}
                            {product.subtitle && (
                              <p className="text-sm text-slate-500 line-clamp-1">
                                {product.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {product.category?.nameEn ||
                          product.category?.nameTh ||
                          "—"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {formatPrice(product)}
                      </TableCell>
                      <TableCell>
                        {score !== null ? (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm text-slate-600">
                              {score.toFixed(1)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={product.status as ContentStatus} />
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm whitespace-nowrap">
                        {product.updatedAt
                          ? new Date(product.updatedAt).toLocaleDateString("th-TH", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/products/${product.id}/edit`}
                            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <Dropdown
                            trigger={
                              <button className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                <Eye className="h-4 w-4" />
                              </button>
                            }
                          >
                            {product.status !== "published" && (
                              <DropdownItem
                                onClick={() =>
                                  handleStatusChange(product.id, "published")
                                }
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Publish
                              </DropdownItem>
                            )}
                            {product.status !== "draft" && (
                              <DropdownItem
                                onClick={() =>
                                  handleStatusChange(product.id, "draft")
                                }
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Move to Draft
                              </DropdownItem>
                            )}
                            
                            <DropdownDivider />
                            <DropdownItem
                              danger
                              onClick={() => deleteModal.openModal(product.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownItem>
                          </Dropdown>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
        title="Delete Product"
        message="Are you sure you want to delete this product? This will also remove it from any collections."
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
}
