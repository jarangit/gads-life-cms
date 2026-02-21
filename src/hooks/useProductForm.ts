import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { ProductFormData, AffiliateLink } from "@/types";
import { generateSlug, generateId } from "@/utils";
import { useProductDetail } from "@/api/queries/product/detail";
import {
  useCreateProduct,
  useUpdateProduct,
  type CreateProductPayload,
} from "@/api/queries/product/mutation";
import { EDITABLE_PAYLOAD_FIELDS } from "@/config/editableFields";

const initialFormData: ProductFormData = {
  name: "",
  slug: "",
  brandId: "",
  categoryIds: [],
  shortDescription: "",
  sections: [],
  pros: [""],
  cons: [""],
  specs: [{ key: "", value: "" }],
  rating: undefined,
  price: undefined,
  heroImage: "",
  galleryImages: [],
  affiliateLinks: [],
  status: "draft",
  isRecommended: false,
  currency: "THB",
  priceLabel: "",
  lastUpdated: new Date().toISOString().split("T")[0],
  // New product detail fields
  keyHighlights: [""],
  weaknesses: [""],
  beforePurchasePoints: [""],
  afterUsagePoints: [""],
  quickVerdictQuote: "",
  quickVerdictDescription: "",
  quickVerdictTags: [""],
  pricingPrice: undefined,
  pricingCurrency: "THB",
  pricingLabel: "",
  ratings: [],
  buyIfPoints: [""],
  skipIfPoints: [""],
};

export function useProductForm(id?: string) {
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { data: productDetail, isLoading } = useProductDetail(id ?? "");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(id ?? "");

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});

  // Store original payload when loading for partial update comparison
  const originalPayloadRef = useRef<Partial<CreateProductPayload> | null>(null);

  const isSaving = createProduct.isPending || updateProduct.isPending;

  // Load existing product data from API
  useEffect(() => {
    if (isEditing && productDetail) {
      setFormData({
        name: productDetail.name || "",
        slug: productDetail.slug || "",
        brandId: productDetail.brandId || "",
        categoryIds: productDetail.categoryId ? [productDetail.categoryId] : [],
        shortDescription: productDetail.subtitle || "",
        sections: [],
        pros: productDetail.pros?.length
          ? productDetail.pros.map((p) => p.content)
          : [""],
        cons: productDetail.cons?.length
          ? productDetail.cons.map((c) => c.content)
          : [""],
        specs: [{ key: "", value: "" }],
        rating: productDetail.overallScore
          ? Number(productDetail.overallScore)
          : undefined,
        price: productDetail.price,
        heroImage: productDetail.image || "",
        galleryImages: [],
        affiliateLinks: productDetail.affiliateLink
          ? [
              {
                id: generateId(),
                merchant: "",
                url: productDetail.affiliateLink,
                price: undefined,
                note: "",
              },
            ]
          : [],
        status: (productDetail.status as "draft" | "published") || "draft",
        isRecommended: Boolean(productDetail.isRecommended),
        currency: productDetail.currency || "THB",
        priceLabel: productDetail.priceLabel || "",
        lastUpdated: productDetail.lastUpdated
          ? String(productDetail.lastUpdated).split("T")[0]
          : new Date().toISOString().split("T")[0],
        // New detail fields
        keyHighlights: productDetail.keyHighlights?.length
          ? productDetail.keyHighlights.map((h) => h.content)
          : [""],
        weaknesses: productDetail.weaknesses?.length
          ? productDetail.weaknesses.map((w) => w.content)
          : [""],
        beforePurchasePoints: productDetail.beforePurchasePoints?.length
          ? productDetail.beforePurchasePoints.map((p) => p.content)
          : [""],
        afterUsagePoints: productDetail.afterUsagePoints?.length
          ? productDetail.afterUsagePoints.map((p) => p.content)
          : [""],
        quickVerdictQuote: productDetail.quickVerdict?.quote || "",
        quickVerdictDescription: productDetail.quickVerdict?.description || "",
        quickVerdictTags: productDetail.quickVerdictTags?.length
          ? productDetail.quickVerdictTags.map((t) => t.tag)
          : [""],
        pricingPrice: productDetail.pricing?.price ?? productDetail.price,
        pricingCurrency: productDetail.pricing?.currency || "THB",
        pricingLabel:
          productDetail.pricing?.priceLabel || productDetail.priceLabel || "",
        ratings:
          productDetail.ratings?.map((r) => ({
            subCategory: r.subCategory,
            score: r.score,
          })) ?? [],
        buyIfPoints:
          productDetail.finalVerdictPoints
            ?.filter((point) => point.type === "BUY_IF")
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((point) => point.text) ?? [""],
        skipIfPoints:
          productDetail.finalVerdictPoints
            ?.filter((point) => point.type === "SKIP_IF")
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((point) => point.text) ?? [""],
      });

      // Store original payload values for editable fields (for partial update comparison)
      originalPayloadRef.current = {
        name: productDetail.name || "",
        slug: productDetail.slug || "",
        subtitle: productDetail.subtitle || productDetail.name || "",
        categoryId: productDetail.categoryId || null,
        brandId: productDetail.brandId || null,
        image: productDetail.image || null,
        status: (productDetail.status as "draft" | "published") || "draft",
        affiliateLink: productDetail.affiliateLink || null,
      };
    }
  }, [productDetail, isEditing]);

  // Generic field change handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name } = e.target;
    const value =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "name" && !isEditing) {
        newData.slug = generateSlug(String(value));
      }
      return newData;
    });
    if (errors[name as keyof ProductFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Direct field update
  const updateField = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Pros handlers
  const handleProChange = (index: number, value: string) => {
    const newPros = [...formData.pros];
    newPros[index] = value;
    setFormData((prev) => ({ ...prev, pros: newPros }));
  };

  const addPro = () => {
    setFormData((prev) => ({ ...prev, pros: [...prev.pros, ""] }));
  };

  const removePro = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pros: prev.pros.filter((_, i) => i !== index),
    }));
  };

  // Cons handlers
  const handleConChange = (index: number, value: string) => {
    const newCons = [...formData.cons];
    newCons[index] = value;
    setFormData((prev) => ({ ...prev, cons: newCons }));
  };

  const addCon = () => {
    setFormData((prev) => ({ ...prev, cons: [...prev.cons, ""] }));
  };

  const removeCon = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      cons: prev.cons.filter((_, i) => i !== index),
    }));
  };

  // Specs handlers
  const handleSpecChange = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newSpecs = [...formData.specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData((prev) => ({ ...prev, specs: newSpecs }));
  };

  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, { key: "", value: "" }],
    }));
  };

  const removeSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  // Affiliate link handlers
  const handleLinkChange = (
    index: number,
    field: keyof AffiliateLink,
    value: string | number,
  ) => {
    const newLinks = [...formData.affiliateLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData((prev) => ({ ...prev, affiliateLinks: newLinks }));
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      affiliateLinks: [
        ...prev.affiliateLinks,
        { id: generateId(), merchant: "", url: "", price: undefined, note: "" },
      ],
    }));
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      affiliateLinks: prev.affiliateLinks.filter((_, i) => i !== index),
    }));
  };

  // Category toggle
  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((c) => c !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  // ─── Generic string-list handlers (highlights, weaknesses, points, tags) ───
  const makeListHandlers = (field: keyof ProductFormData) => ({
    handleChange: (index: number, value: string) => {
      setFormData((prev) => {
        const list = [...(prev[field] as string[])];
        list[index] = value;
        return { ...prev, [field]: list };
      });
    },
    add: () => {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), ""],
      }));
    },
    remove: (index: number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index),
      }));
    },
  });

  const keyHighlightsHandlers = makeListHandlers("keyHighlights");
  const weaknessesHandlers = makeListHandlers("weaknesses");
  const beforePurchaseHandlers = makeListHandlers("beforePurchasePoints");
  const afterUsageHandlers = makeListHandlers("afterUsagePoints");
  const verdictTagsHandlers = makeListHandlers("quickVerdictTags");
  const buyIfHandlers = makeListHandlers("buyIfPoints");
  const skipIfHandlers = makeListHandlers("skipIfPoints");

  // Ratings handlers
  const handleRatingItemChange = (
    index: number,
    field: "subCategory" | "score",
    value: string | number,
  ) => {
    setFormData((prev) => {
      const newRatings = [...prev.ratings];
      newRatings[index] = { ...newRatings[index], [field]: value };
      return { ...prev, ratings: newRatings };
    });
  };

  const addRating = () => {
    setFormData((prev) => ({
      ...prev,
      ratings: [...prev.ratings, { subCategory: "", score: 3 }],
    }));
  };

  const removeRating = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ratings: prev.ratings.filter((_, i) => i !== index),
    }));
  };

  // JSON Import
  const importFromJson = (jsonString: string): string | null => {
    if (!jsonString.trim()) {
      return "Please enter JSON data";
    }

    try {
      const parsed = JSON.parse(jsonString);

      if (!parsed.name || typeof parsed.name !== "string") {
        return 'JSON must include a valid "name" field';
      }

      const importedData: ProductFormData = {
        name: parsed.name || "",
        slug: parsed.slug || generateSlug(parsed.name || ""),
        brandId: parsed.brandId || "",
        categoryIds: Array.isArray(parsed.categoryIds)
          ? parsed.categoryIds
          : parsed.categoryId
            ? [parsed.categoryId]
            : [],
        shortDescription: parsed.subtitle || parsed.shortDescription || "",
        sections: Array.isArray(parsed.sections) ? parsed.sections : [],
        pros: normalizeStringList(parsed.pros),
        cons: normalizeStringList(parsed.cons),
        specs:
          Array.isArray(parsed.specs) && parsed.specs.length > 0
            ? parsed.specs
            : [{ key: "", value: "" }],
        rating:
          typeof parsed.overallScore === "number"
            ? parsed.overallScore
            : typeof parsed.rating === "number"
              ? parsed.rating
              : undefined,
        price: typeof parsed.price === "number" ? parsed.price : undefined,
        heroImage: parsed.image || parsed.heroImage || "",
        galleryImages: Array.isArray(parsed.galleryImages)
          ? parsed.galleryImages
          : [],
        affiliateLinks: Array.isArray(parsed.affiliateLinks)
          ? parsed.affiliateLinks.map((link: any) => ({
              id: link.id || generateId(),
              merchant: link.merchant || "",
              url: link.url || "",
              price: link.price,
              note: link.note || "",
            }))
          : parsed.affiliateLink
            ? [
                {
                  id: generateId(),
                  merchant: "",
                  url: parsed.affiliateLink,
                  price: undefined,
                  note: "",
                },
              ]
          : [],
        status:
          parsed.status === "published" || parsed.status === "draft"
            ? parsed.status
            : "draft",
        isRecommended: Boolean(parsed.isRecommended),
        currency: parsed.currency || "THB",
        priceLabel: parsed.priceLabel || "",
        lastUpdated:
          typeof parsed.lastUpdated === "string" && parsed.lastUpdated
            ? parsed.lastUpdated
            : new Date().toISOString().split("T")[0],
        keyHighlights: normalizeStringList(parsed.keyHighlights),
        weaknesses: normalizeStringList(parsed.weaknesses),
        beforePurchasePoints: normalizeStringList(parsed.beforePurchasePoints),
        afterUsagePoints: normalizeStringList(parsed.afterUsagePoints),
        quickVerdictQuote:
          parsed.quickVerdict?.quote || parsed.quickVerdictQuote || "",
        quickVerdictDescription:
          parsed.quickVerdict?.description || parsed.quickVerdictDescription || "",
        quickVerdictTags: normalizeTagList(parsed.quickVerdictTags),
        pricingPrice:
          typeof parsed.pricing?.price === "number"
            ? parsed.pricing.price
            :
          typeof parsed.pricingPrice === "number"
            ? parsed.pricingPrice
            : undefined,
        pricingCurrency: parsed.pricing?.currency || parsed.pricingCurrency || "THB",
        pricingLabel: parsed.pricing?.priceLabel || parsed.pricingLabel || "",
        ratings: normalizeRatings(parsed.ratings),
        buyIfPoints: extractFinalVerdictByType(parsed.finalVerdictPoints, "BUY_IF"),
        skipIfPoints: extractFinalVerdictByType(parsed.finalVerdictPoints, "SKIP_IF"),
      };

      setFormData(importedData);
      return null; // No error
    } catch (e) {
      return `Invalid JSON format: ${e instanceof Error ? e.message : "Unknown error"}`;
    }
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Build payload for API
  const buildPayload = (
    statusOverride?: "draft" | "published",
  ): CreateProductPayload => {
    // const filterNonEmpty = (arr: string[]) => arr.filter((s) => s.trim());

    console.log("🚀 ~ buildPayload ~ formData:", formData);
    return {
      slug: formData.slug,
      name: formData.name,
      subtitle: formData.shortDescription || formData.name,
      categoryId:
        formData.categoryIds.length > 0 ? formData.categoryIds[0] : null,
      brandId: formData.brandId || null,
      image: formData.heroImage || null,
      overallScore: formData.rating ?? 0,
      isRecommended: formData.isRecommended,
      price: formData.price ?? 0,
      currency: formData.currency || "THB",
      priceLabel:
        formData.priceLabel ||
        (formData.price ? `฿${formData.price.toLocaleString()}` : "฿0"),
      affiliateLink:
        formData.affiliateLinks.length > 0
          ? formData.affiliateLinks[0].url
          : null,
      lastUpdated: formData.lastUpdated || new Date().toISOString().split("T")[0],
      ratings: formData.ratings.filter((r) => r.subCategory.trim()),
      status: statusOverride || (formData.status as "draft" | "published"),
      keyHighlights: formData.keyHighlights.filter((c) => c.trim()).map((c, i) => ({
        content: c,
        sortOrder: i + 1,
      })),
      weaknesses: formData.weaknesses.filter((c) => c.trim()).map((c, i) => ({
        content: c,
        sortOrder: i + 1,
      })),
      beforePurchasePoints: formData.beforePurchasePoints.filter((c) => c.trim()).map((c, i) => ({
        content: c,
        sortOrder: i + 1,
      })),
      afterUsagePoints: formData.afterUsagePoints.filter((c) => c.trim()).map((c, i) => ({
        content: c,
        sortOrder: i + 1,
      })),
      pros: formData.pros.filter((c) => c.trim()).map((c, i) => ({
        content: c,
        sortOrder: i + 1,
      })),
      cons: formData.cons.filter((c) => c.trim()).map((c, i) => ({
        content: c,
        sortOrder: i + 1,
      })),
      quickVerdict: formData.quickVerdictQuote.trim()
        ? {
            quote: formData.quickVerdictQuote,
            description: formData.quickVerdictDescription,
          }
        : null,
      quickVerdictTags: formData.quickVerdictTags.filter((t) => t.trim()).map((t, i) => ({
        tag: t,
        sortOrder: i + 1,
      })),
      pricing:
        formData.pricingPrice != null
          ? {
              price: formData.pricingPrice,
              currency: formData.pricingCurrency || "THB",
              priceLabel: formData.pricingLabel,
            }
          : null,
      finalVerdictPoints: [
        ...formData.buyIfPoints.filter((text) => text.trim()).map((text, index) => ({
          type: "BUY_IF" as const,
          text,
          orderIndex: index + 1,
        })),
        ...formData.skipIfPoints.filter((text) => text.trim()).map((text, index) => ({
          type: "SKIP_IF" as const,
          text,
          orderIndex: index + 1,
        })),
      ],
    };
  };

  // Build partial payload for editing (only changed editable fields)
  const buildPartialPayload = (
    statusOverride?: "draft" | "published",
  ): Partial<CreateProductPayload> => {
    const currentPayload: Record<string, unknown> = {
      name: formData.name,
      slug: formData.slug,
      subtitle: formData.shortDescription || formData.name,
      categoryId:
        formData.categoryIds.length > 0 ? formData.categoryIds[0] : null,
      brandId: formData.brandId || null,
      image: formData.heroImage || null,
      status: statusOverride || (formData.status as "draft" | "published"),
      affiliateLink:
        formData.affiliateLinks.length > 0
          ? formData.affiliateLinks[0].url
          : null,
    };

    const original = originalPayloadRef.current;
    if (!original) {
      // Fallback to all editable fields if no original
      return currentPayload as Partial<CreateProductPayload>;
    }

    // Compare and return only changed fields
    const changedPayload: Partial<CreateProductPayload> = {};

    for (const field of EDITABLE_PAYLOAD_FIELDS) {
      const currentValue = currentPayload[field];
      const originalValue = original[field as keyof CreateProductPayload];

      // Deep comparison for objects, simple comparison for primitives
      if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
        (changedPayload as Record<string, unknown>)[field] = currentValue;
      }
    }

    // Always include status if override is provided
    if (statusOverride) {
      changedPayload.status = statusOverride;
    }

    return changedPayload;
  };

  // Submit handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditing) {
        // Partial update: only send changed fields
        const partialPayload = buildPartialPayload();
        if (Object.keys(partialPayload).length > 0) {
          await updateProduct.mutateAsync(partialPayload);
        }
      } else {
        // Create: send full payload
        const payload = buildPayload();
        await createProduct.mutateAsync(payload);
      }
      navigate("/products");
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const handleSaveAndPublish = async () => {
    if (!validate()) return;

    try {
      if (isEditing) {
        // Partial update: only send changed fields + status
        const partialPayload = buildPartialPayload("published");
        await updateProduct.mutateAsync(partialPayload);
      } else {
        // Create: send full payload
        const payload = buildPayload("published");
        await createProduct.mutateAsync(payload);
      }
      navigate("/products");
    } catch (error) {
      console.error("Failed to save & publish product:", error);
    }
  };

  return {
    // State
    formData,
    errors,
    isLoading,
    isSaving,
    isEditing,

    // Actions
    handleChange,
    updateField,
    handleSubmit,
    handleSaveAndPublish,

    // Pros & Cons
    handleProChange,
    addPro,
    removePro,
    handleConChange,
    addCon,
    removeCon,

    // Specs
    handleSpecChange,
    addSpec,
    removeSpec,

    // Affiliate Links
    handleLinkChange,
    addLink,
    removeLink,

    // Categories
    toggleCategory,

    // Product Details — list handlers
    keyHighlightsHandlers,
    weaknessesHandlers,
    beforePurchaseHandlers,
    afterUsageHandlers,
    verdictTagsHandlers,
    buyIfHandlers,
    skipIfHandlers,

    // Ratings
    handleRatingItemChange,
    addRating,
    removeRating,

    // JSON Import
    importFromJson,

    // Navigation
    navigate,
  };
}

// Helper functions
const normalizeStringList = (input: unknown): string[] => {
  if (!Array.isArray(input)) return [""];
  const list = input
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "content" in item) {
        const v = (item as { content?: unknown }).content;
        return typeof v === "string" ? v : "";
      }
      return "";
    })
    .filter((v) => typeof v === "string");

  return list.length > 0 ? list : [""];
};

const normalizeTagList = (input: unknown): string[] => {
  if (!Array.isArray(input)) return [""];
  const list = input
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "tag" in item) {
        const v = (item as { tag?: unknown }).tag;
        return typeof v === "string" ? v : "";
      }
      return "";
    })
    .filter((v) => typeof v === "string");

  return list.length > 0 ? list : [""];
};

const normalizeRatings = (input: unknown): { subCategory: string; score: number }[] => {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const subCategory =
        "subCategory" in item && typeof item.subCategory === "string"
          ? item.subCategory
          : "";
      const scoreRaw = "score" in item ? Number(item.score) : NaN;
      const score = Number.isFinite(scoreRaw) ? scoreRaw : 0;
      if (!subCategory.trim()) return null;
      return { subCategory, score };
    })
    .filter((item): item is { subCategory: string; score: number } => item !== null);
};

const extractFinalVerdictByType = (
  input: unknown,
  type: "BUY_IF" | "SKIP_IF",
): string[] => {
  if (!Array.isArray(input)) return [""];

  const list = input
    .filter(
      (item): item is { type?: unknown; text?: unknown; orderIndex?: unknown } =>
        Boolean(item) && typeof item === "object",
    )
    .filter((item) => item.type === type)
    .sort((a, b) => Number(a.orderIndex ?? 0) - Number(b.orderIndex ?? 0))
    .map((item) => (typeof item.text === "string" ? item.text : ""))
    .filter((text) => text.trim());

  return list.length > 0 ? list : [""];
};
