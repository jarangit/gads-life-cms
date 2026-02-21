import {
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";
import type { ProductFormData } from "@/types";
import { useCategories } from "@/api/queries/category/list";
import { useBrands } from "@/api/queries/brands/list";

interface BasicInfoTabProps {
  formData: ProductFormData;
  errors: Partial<Record<keyof ProductFormData, string>>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onCategoryToggle: (categoryId: string) => void;
  onPriceChange: (value: number | undefined) => void;
  onRatingChange: (value: number | undefined) => void;
}

export function BasicInfoTab({
  formData,
  errors,
  onChange,
  onCategoryToggle,
  onPriceChange,
  onRatingChange,
}: BasicInfoTabProps) {
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const brandOptions = [
    { value: "", label: "Select a brand" },
    ...(brands?.map((b) => ({ value: b.id, label: b.name })) || []),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={onChange}
          error={errors.name}
          placeholder="e.g., MacBook Air M3"
        />

        <Input
          label="Slug"
          name="slug"
          value={formData.slug}
          onChange={onChange}
          error={errors.slug}
          hint="URL-friendly identifier"
          placeholder="e.g., macbook-air-m3"
        />

        <Select
          label="Brand"
          name="brandId"
          value={formData.brandId}
          onChange={onChange}
          options={brandOptions}
          error={errors.brandId}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {categories?.items?.map((cat) => (
              <label
                key={cat.id}
                className={`inline-flex cursor-pointer items-center rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  formData.categoryIds.includes(cat.id)
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={formData.categoryIds.includes(cat.id)}
                  onChange={() => onCategoryToggle(cat.id)}
                />
                {cat.nameTh || cat.slug}
              </label>
            ))}
          </div>
        </div>

        <Textarea
          label="Short Description"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={onChange}
          placeholder="Brief product overview"
          rows={3}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Price ($)"
            name="price"
            type="number"
            value={formData.price || ""}
            onChange={(e) =>
              onPriceChange(e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="e.g., 999"
          />

          <Input
            label="Rating (0-5)"
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating || ""}
            onChange={(e) =>
              onRatingChange(
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            placeholder="e.g., 4.5"
          />
        </div>
      </CardContent>
    </Card>
  );
}
