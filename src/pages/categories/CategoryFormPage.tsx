import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Select,
  ImageUpload,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";
import { PageHeader } from "@/components/common";
import type { ICreateCategoryPayload } from "@/api/types/category";
import { useCreateCategory } from "@/api/queries/category/mutation";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // mutation
  const categoryMutation = useCreateCategory();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ICreateCategoryPayload>({
    defaultValues: {
      slug: "",
      nameTh: "",
      nameEn: null,
      description: null,
      heroImage: null,
      isActive: false,
      orderIndex: 0,
    },
  });

  // Watch nameTh field to auto-generate slug
  const nameThValue = watch("nameTh");

  useEffect(() => {
    if (!isEditing && nameThValue) {
      setValue("slug", generateSlug(nameThValue));
    }
  }, [nameThValue, isEditing, setValue]);

  useEffect(() => {
    if (isEditing && id) {
      setIsLoading(true);
      // TODO: Fetch category by id and reset form
      // For now, simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [id, isEditing, reset]);

  const onSubmit = async (data: ICreateCategoryPayload) => {
    categoryMutation.mutate(data);
    console.log("🚀 ~ onSubmit ~ data:", data);
    setIsSaving(true);
    // TODO: Implement create/update mutation
    setTimeout(() => {
      setIsSaving(false);
      navigate("/categories");
    }, 500);
  };

  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  const transformStatusValue = (value: string): boolean => {
    return value === "1" || value === "true" ? true : false;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? "Edit Category" : "New Category"}
        description={
          isEditing
            ? "Update category details"
            : "Create a new product category"
        }
        actions={
          <Button
            variant="ghost"
            onClick={() => navigate("/categories")}
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
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Name (Thai)"
                  placeholder="e.g., แล็ปท็อปเกมมิ่ง"
                  error={errors.nameTh?.message}
                  {...register("nameTh", {
                    required: "Name (Thai) is required",
                  })}
                />

                <Input
                  label="Name (English)"
                  placeholder="e.g., Gaming Laptops"
                  {...register("nameEn")}
                />

                <Input
                  label="Slug"
                  hint="URL-friendly identifier"
                  placeholder="e.g., gaming-laptops"
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

                <Textarea
                  label="Description"
                  placeholder="Brief description of this category"
                  rows={3}
                  {...register("description")}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Image</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  name="heroImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value ?? undefined}
                      onChange={(url) => field.onChange(url || null)}
                      hint="Recommended: 1200x630px"
                    />
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Status"
                      options={statusOptions}
                      value={field.value ? "1" : "0"}
                      onChange={(e) =>
                        field.onChange(transformStatusValue(e.target.value))
                      }
                    />
                  )}
                />

                <Input
                  label="Order Index"
                  type="number"
                  placeholder="0"
                  {...register("orderIndex", { valueAsNumber: true })}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <Button type="submit" isLoading={isSaving} className="w-full">
                    {isEditing ? "Update Category" : "Create Category"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/categories")}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
