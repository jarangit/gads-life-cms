import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Plus, Trash2, Package, ExternalLink } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";
import {
  PageHeader,
  DeleteConfirmModal,
  useDeleteModal,
} from "@/components/common";
import { useCollection } from "@/api/queries/collection/detail";
import {
  useCreateCollection,
  useUpdateCollection,
} from "@/api/queries/collection/mutation";
import { useCategories } from "@/api/queries/category/list";
import { useBrands } from "@/api/queries/brands/list";
import { useProducts } from "@/api/queries/product/product";
import {
  useCreateCollectionItem,
  useUpdateCollectionItem,
  useDeleteCollectionItem,
} from "@/api/queries/collection-item/mutation";
import type {
  ICreateCollectionPayload,
  IUpdateCollectionPayload,
  CollectionType,
  CollectionStatus,
  ICollectionItemProduct,
} from "@/api/types/collection";

interface CollectionFormValues {
  type: CollectionType;
  slug: string;
  titleTh: string;
  titleEn: string;
  excerpt: string;
  coverImage: string;
  categoryId: string;
  status: CollectionStatus;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CollectionFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { data: collection, isLoading } = useCollection(id);
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection(id ?? "");
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();

  // Product filter states
  const [filterBrandId, setFilterBrandId] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");

  const hasProductFilter = Boolean(filterBrandId || filterCategoryId);
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    brandId: filterBrandId || undefined,
    categoryId: filterCategoryId || undefined,
    enabled: hasProductFilter,
  });

  // Collection item mutations
  const createItem = useCreateCollectionItem();
  const updateItem = useUpdateCollectionItem(id ?? "");
  const deleteItem = useDeleteCollectionItem(id ?? "");
  const deleteModal = useDeleteModal();

  const [selectedProductId, setSelectedProductId] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState(0);
  const [editingNote, setEditingNote] = useState("");
  const [editingOriginalPrice, setEditingOriginalPrice] = useState("");
  const [editingDealPrice, setEditingDealPrice] = useState("");
  const [editingCurrency, setEditingCurrency] = useState("THB");
  const [editingDealBadge, setEditingDealBadge] = useState("");
  const [editingDealUrl, setEditingDealUrl] = useState("");
  const [editingDealStartAt, setEditingDealStartAt] = useState("");
  const [editingDealEndAt, setEditingDealEndAt] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CollectionFormValues>({
    defaultValues: {
      type: "TOP_LIST",
      slug: "",
      titleTh: "",
      titleEn: "",
      excerpt: "",
      coverImage: "",
      categoryId: "",
      status: "DRAFT",
    },
  });

  const titleThValue = watch("titleTh");

  // Auto-generate slug from titleTh (create mode only)
  useEffect(() => {
    if (!isEditing && titleThValue !== undefined) {
      setValue("slug", generateSlug(titleThValue));
    }
  }, [titleThValue, isEditing, setValue]);

  // Populate form when collection data loads (edit mode)
  useEffect(() => {
    if (collection) {
      reset({
        type: collection.type,
        slug: collection.slug,
        titleTh: collection.titleTh,
        titleEn: collection.titleEn ?? "",
        excerpt: collection.excerpt ?? "",
        coverImage: collection.coverImage ?? "",
        categoryId: collection.categoryId ?? "",
        status: collection.status,
      });
    }
  }, [collection, reset]);

  const isSaving = createCollection.isPending || updateCollection.isPending;

  const onSubmit = async (data: CollectionFormValues) => {
    try {
      if (isEditing) {
        const payload: IUpdateCollectionPayload = {
          type: data.type,
          slug: data.slug,
          titleTh: data.titleTh,
          titleEn: data.titleEn || undefined,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          categoryId: data.categoryId || undefined,
          status: data.status,
        };
        await updateCollection.mutateAsync(payload);
      } else {
        const payload: ICreateCollectionPayload = {
          type: data.type,
          slug: data.slug,
          titleTh: data.titleTh,
          titleEn: data.titleEn || undefined,
          excerpt: data.excerpt || undefined,
          coverImage: data.coverImage || undefined,
          categoryId: data.categoryId || undefined,
        };
        await createCollection.mutateAsync(payload);
      }
      navigate("/collections");
    } catch (error) {
      console.error("Failed to save collection:", error);
    }
  };

  // --- Collection Item Handlers ---
  const collectionItems: ICollectionItemProduct[] = collection?.items ?? [];

  const handleAddProduct = async () => {
    if (!selectedProductId || !id) return;
    try {
      await createItem.mutateAsync({
        collectionId: id,
        productId: selectedProductId,
        orderIndex: collectionItems.length,
      });
      setSelectedProductId("");
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleDeleteItem = () => {
    if (deleteModal.itemId) {
      deleteItem.mutate(deleteModal.itemId, {
        onSuccess: () => deleteModal.closeModal(),
      });
    }
  };

  const handleStartEdit = (item: ICollectionItemProduct) => {
    setEditingItemId(item.id);
    setEditingOrder(item.orderIndex);
    setEditingNote(item.note ?? "");
    setEditingOriginalPrice(item.originalPrice != null ? String(item.originalPrice) : "");
    setEditingDealPrice(item.dealPrice != null ? String(item.dealPrice) : "");
    setEditingCurrency(item.currency || "THB");
    setEditingDealBadge(item.dealBadge ?? "");
    setEditingDealUrl(item.dealUrl ?? "");
    setEditingDealStartAt(item.dealStartAt ? item.dealStartAt.slice(0, 16) : "");
    setEditingDealEndAt(item.dealEndAt ? item.dealEndAt.slice(0, 16) : "");
  };

  const handleSaveEdit = async (itemId: string) => {
    await updateItem.mutateAsync({
      id: itemId,
      payload: {
        orderIndex: editingOrder,
        note: editingNote || null,
        originalPrice: editingOriginalPrice ? Number(editingOriginalPrice) : null,
        dealPrice: editingDealPrice ? Number(editingDealPrice) : null,
        currency: editingCurrency || "THB",
        dealBadge: editingDealBadge || null,
        dealUrl: editingDealUrl || null,
        dealStartAt: editingDealStartAt || null,
        dealEndAt: editingDealEndAt || null,
      },
    });
    setEditingItemId(null);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  // Products available to add (exclude already added ones)
  const productsList = productsData?.items ?? [];
  const addedProductIds = new Set(
    collectionItems.map((item) => item.productId),
  );
  const availableProducts = productsList.filter(
    (p) => !addedProductIds.has(p.id),
  );

  const productOptions = [
    { value: "", label: "Select a product to add..." },
    ...availableProducts.map((p) => ({
      value: p.id,
      label: `${p.name}${p.brand ? ` (${p.brand.name})` : ""}`,
    })),
  ];

  const typeOptions = [
    { value: "TOP_LIST", label: "Top List" },
    { value: "GUIDE", label: "Guide" },
    { value: "COMPARISON", label: "Comparison" },
  ];

  const statusOptions = [
    { value: "DRAFT", label: "Draft" },
    { value: "PUBLISHED", label: "Published" },
    { value: "ARCHIVED", label: "Archived" },
  ];

  const categoryOptions = [
    { value: "", label: "No category" },
    ...(categoriesData?.items?.map((c) => ({
      value: c.id,
      label: c.nameTh || c.slug,
    })) ?? []),
  ];

  const brandFilterOptions = [
    { value: "", label: "All brands" },
    ...(brandsData?.map((b) => ({ value: b.id, label: b.name })) ?? []),
  ];

  const categoryFilterOptions = [
    { value: "", label: "All categories" },
    ...(categoriesData?.items?.map((c) => ({
      value: c.id,
      label: c.nameTh || c.slug,
    })) ?? []),
  ];

  if (isLoading && isEditing) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? "Edit Collection" : "New Collection"}
        description={
          isEditing ? "Update collection details" : "Create a new collection"
        }
        actions={
          <Button
            variant="ghost"
            onClick={() => navigate("/collections")}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Collection Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Title (Thai)"
                  placeholder="e.g., 5 อันดับหุ่นยนต์ดูดฝุ่นที่ดีที่สุด"
                  error={errors.titleTh?.message}
                  {...register("titleTh", {
                    required: "Title (Thai) is required",
                  })}
                />

                <Input
                  label="Title (English)"
                  placeholder="e.g., Top 5 Best Robot Vacuums"
                  {...register("titleEn")}
                />

                <Input
                  label="Slug"
                  hint="URL-friendly identifier"
                  placeholder="e.g., top-5-robot-vacuums"
                  error={errors.slug?.message}
                  {...register("slug", {
                    required: "Slug is required",
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message:
                        "Slug can only contain lowercase letters, numbers, and hyphens",
                    },
                  })}
                />

                <Select
                  label="Type"
                  options={typeOptions}
                  {...register("type", { required: "Type is required" })}
                />

                <Select
                  label="Category"
                  options={categoryOptions}
                  {...register("categoryId")}
                />

                <Textarea
                  label="Excerpt"
                  placeholder="Brief description of this collection"
                  rows={3}
                  {...register("excerpt")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  label="Cover Image URL"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  {...register("coverImage")}
                />
              </CardContent>
            </Card>

            {/* Collection Items - only show in edit mode */}
            {isEditing && id && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Collection Items
                    <span className="ml-2 text-sm font-normal text-slate-500">
                      ({collectionItems.length} products)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Product filter & add */}
                  <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Add Product
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Select
                        label="Brand"
                        options={brandFilterOptions}
                        value={filterBrandId}
                        onChange={(e) => {
                          setFilterBrandId(e.target.value);
                          setSelectedProductId("");
                        }}
                        className="w-full"
                      />
                      <Select
                        label="Category"
                        options={categoryFilterOptions}
                        value={filterCategoryId}
                        onChange={(e) => {
                          setFilterCategoryId(e.target.value);
                          setSelectedProductId("");
                        }}
                        className="w-full"
                      />
                    </div>

                    {!hasProductFilter ? (
                      <p className="text-sm text-slate-400 text-center py-1">
                        Select a brand or category to search for products
                      </p>
                    ) : isLoadingProducts ? (
                      <div className="flex items-center justify-center py-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                        <span className="ml-2 text-sm text-slate-500">
                          Loading products...
                        </span>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-end">
                        <Select
                          label={`Product (${availableProducts.length} available)`}
                          options={productOptions}
                          value={selectedProductId}
                          onChange={(e) => setSelectedProductId(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleAddProduct}
                          disabled={!selectedProductId || createItem.isPending}
                          isLoading={createItem.isPending}
                          leftIcon={<Plus className="h-4 w-4" />}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Items list */}
                  {collectionItems.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-slate-200 py-8 text-center">
                      <Package className="mx-auto h-8 w-8 text-slate-400" />
                      <p className="mt-2 text-sm text-slate-500">
                        No products in this collection yet. Select a product
                        above to get started.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {[...collectionItems]
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .map((item, index) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3"
                          >
                            {/* Rank number */}
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                              {index + 1}
                            </div>

                            {/* Product image */}
                            {item.product?.image ? (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                                <Package className="h-5 w-5 text-slate-400" />
                              </div>
                            )}

                            {/* Product info */}
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium text-slate-900">
                                {item.product?.name ?? "Unknown Product"}
                              </p>
                              <p className="text-sm text-slate-500">
                                {item.product?.subtitle}
                              </p>

                              {editingItemId === item.id ? (
                                <div className="mt-3 space-y-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3">
                                  {/* Row 1: Order & Note */}
                                  <div className="grid gap-2 sm:grid-cols-[80px_1fr]">
                                    <Input
                                      label="Order"
                                      value={editingOrder}
                                      onChange={(e) =>
                                        setEditingOrder(Number(e.target.value))
                                      }
                                      type="number"
                                      min={0}
                                    />
                                    <Input
                                      label="Note"
                                      value={editingNote}
                                      onChange={(e) =>
                                        setEditingNote(e.target.value)
                                      }
                                      placeholder="e.g., Best overall"
                                    />
                                  </div>

                                  {/* Row 2: Pricing */}
                                  <div className="grid gap-2 sm:grid-cols-3">
                                    <Input
                                      label="Original Price"
                                      value={editingOriginalPrice}
                                      onChange={(e) =>
                                        setEditingOriginalPrice(e.target.value)
                                      }
                                      type="number"
                                      min={0}
                                      placeholder="0"
                                    />
                                    <Input
                                      label="Deal Price"
                                      value={editingDealPrice}
                                      onChange={(e) =>
                                        setEditingDealPrice(e.target.value)
                                      }
                                      type="number"
                                      min={0}
                                      placeholder="0"
                                    />
                                    <Input
                                      label="Currency"
                                      value={editingCurrency}
                                      onChange={(e) =>
                                        setEditingCurrency(e.target.value)
                                      }
                                      placeholder="THB"
                                    />
                                  </div>

                                  {/* Row 3: Deal Badge & URL */}
                                  <div className="grid gap-2 sm:grid-cols-[1fr_2fr]">
                                    <Input
                                      label="Deal Badge"
                                      value={editingDealBadge}
                                      onChange={(e) =>
                                        setEditingDealBadge(e.target.value)
                                      }
                                      placeholder="e.g., -30%, Flash Sale"
                                    />
                                    <Input
                                      label="Deal URL"
                                      value={editingDealUrl}
                                      onChange={(e) =>
                                        setEditingDealUrl(e.target.value)
                                      }
                                      placeholder="https://..."
                                    />
                                  </div>

                                  {/* Row 4: Deal Dates */}
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    <Input
                                      label="Deal Start"
                                      type="datetime-local"
                                      value={editingDealStartAt}
                                      onChange={(e) =>
                                        setEditingDealStartAt(e.target.value)
                                      }
                                    />
                                    <Input
                                      label="Deal End"
                                      type="datetime-local"
                                      value={editingDealEndAt}
                                      onChange={(e) =>
                                        setEditingDealEndAt(e.target.value)
                                      }
                                    />
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-2 pt-1">
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => handleSaveEdit(item.id)}
                                      isLoading={updateItem.isPending}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      onClick={handleCancelEdit}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="mt-1 space-y-1">
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                    <span>Order: {item.orderIndex}</span>
                                    {item.note && (
                                      <>
                                        <span>•</span>
                                        <span className="italic">
                                          &ldquo;{item.note}&rdquo;
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {(item.originalPrice != null ||
                                    item.dealPrice != null ||
                                    item.dealBadge ||
                                    item.dealUrl) && (
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                      {item.originalPrice != null && (
                                        <span className="text-slate-400 line-through">
                                          {item.originalPrice.toLocaleString()}{" "}
                                          {item.currency}
                                        </span>
                                      )}
                                      {item.dealPrice != null && (
                                        <span className="font-medium text-green-600">
                                          {item.dealPrice.toLocaleString()}{" "}
                                          {item.currency}
                                        </span>
                                      )}
                                      {item.dealBadge && (
                                        <span className="rounded bg-orange-100 px-1.5 py-0.5 text-orange-700">
                                          {item.dealBadge}
                                        </span>
                                      )}
                                      {item.dealUrl && (
                                        <a
                                          href={item.dealUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-0.5 text-blue-500 hover:underline"
                                        >
                                          Deal Link{" "}
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            {editingItemId !== item.id && (
                              <div className="flex shrink-0 items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(item)}
                                  className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                  title="Edit"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M17 3a2.85 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteModal.openModal(item.id)}
                                  className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                  title="Remove"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {!isEditing && (
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-sm text-slate-500">
                    Save the collection first, then you can add products to it.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select options={statusOptions} {...register("status")} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <Button type="submit" isLoading={isSaving} className="w-full">
                    {isEditing ? "Update Collection" : "Create Collection"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/collections")}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Products</dt>
                      <dd className="font-medium text-slate-900">
                        {collectionItems.length}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Category</dt>
                      <dd className="font-medium text-slate-900">
                        {collection?.category?.nameTh || "—"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeleteItem}
        title="Remove Product"
        message="Are you sure you want to remove this product from the collection?"
      />
    </div>
  );
}
