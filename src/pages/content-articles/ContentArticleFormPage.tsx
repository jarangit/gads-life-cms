import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  FileJson,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Alert,
  Toggle,
} from "@/components/ui";
import { PageHeader } from "@/components/common";
import { useContentArticle } from "@/api/queries/content-article/detail";
import {
  useCreateContentArticle,
  useUpdateContentArticle,
} from "@/api/queries/content-article/mutation";
import type {
  ContentType,
  ContentStatus,
  IContentSectionPayload,
  IContentTagPayload,
  ICreateContentArticlePayload,
  IUpdateContentArticlePayload,
} from "@/api/types/content-article";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SectionFormValue {
  heading: string;
  body: string;
  sortOrder: number;
}

interface ArticleFormValues {
  slug: string;
  title: string;
  summary: string;
  excerpt: string;
  type: ContentType;
  status: ContentStatus;
  publishedAt: string;
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  heroImageAlt: string;
  sections: SectionFormValue[];
  tags: string; // comma-separated
}

// ─── JSON Template ────────────────────────────────────────────────────────────

const JSON_TEMPLATE = JSON.stringify(
  {
    slug: "my-article-slug",
    title: "Article Title",
    summary:
      "Full summary / body content of the article goes here. Supports markdown.",
    excerpt: "Short excerpt shown in listing pages.",
    type: "GUIDE",
    status: "DRAFT",
    publishedAt: null,
    isFeatured: false,
    metaTitle: "SEO Title",
    metaDescription: "SEO description for search engines.",
    heroImage: "https://example.com/hero.jpg",
    heroImageAlt: "Hero image alt text",
    sections: [
      {
        heading: "Section Heading",
        body: "Section body content.",
        sortOrder: 1,
      },
    ],
    tags: ["tech", "review"],
  },
  null,
  2,
);

// ─── Static options ───────────────────────────────────────────────────────────

const typeOptions = [
  { value: "NEWS", label: "News" },
  { value: "REVIEW", label: "Review" },
  { value: "GUIDE", label: "Guide" },
  { value: "COMPARISON", label: "Comparison" },
];

const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

type TabId = "basic" | "seo" | "sections" | "tags" | "json";

const tabs: { id: TabId; label: string; icon?: React.ReactNode }[] = [
  { id: "basic", label: "Basic Info" },
  { id: "seo", label: "SEO" },
  { id: "sections", label: "Sections" },
  { id: "tags", label: "Tags" },
  {
    id: "json",
    label: "Import JSON",
    icon: <FileJson className="h-4 w-4" />,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u0E00-\u0E7F]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ContentArticleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const { data: article, isLoading } = useContentArticle(id);
  const createArticle = useCreateContentArticle();
  const updateArticle = useUpdateContentArticle(id ?? "");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    defaultValues: {
      slug: "",
      title: "",
      summary: "",
      excerpt: "",
      type: "GUIDE",
      status: "DRAFT",
      publishedAt: "",
      isFeatured: false,
      metaTitle: "",
      metaDescription: "",
      heroImage: "",
      heroImageAlt: "",
      sections: [],
      tags: "",
    },
  });

  const titleValue = watch("title");

  const { fields: sectionFields, append: appendSection, remove: removeSection } =
    useFieldArray({ control, name: "sections" });

  // Auto-generate slug from title on create
  useEffect(() => {
    if (!isEditing && titleValue && !watch("slug")) {
      setValue("slug", generateSlug(titleValue));
    }
  }, [titleValue, isEditing, setValue, watch]);

  // Populate form in edit mode
  useEffect(() => {
    if (article) {
      reset({
        slug: article.slug,
        title: article.title,
        summary: article.summary ?? "",
        excerpt: article.excerpt ?? "",
        type: article.type,
        status: article.status,
        publishedAt: article.publishedAt
          ? article.publishedAt.split("T")[0]
          : "",
        isFeatured: Boolean(article.isFeatured),
        metaTitle: article.metaTitle ?? "",
        metaDescription: article.metaDescription ?? "",
        heroImage: article.heroImage ?? "",
        heroImageAlt: article.heroImageAlt ?? "",
        sections: article.sections?.map((s) => ({
          heading: s.heading ?? "",
          body: s.body,
          sortOrder: s.sortOrder,
        })) ?? [],
        tags: article.tags?.map((t) => t.value).join(", ") ?? "",
      });
    }
  }, [article, reset]);

  const isSaving = createArticle.isPending || updateArticle.isPending;

  // ─── JSON Import ────────────────────────────────────────────────────────────

  const handleJsonImport = () => {
    setJsonError(null);
    try {
      const parsed = JSON.parse(jsonInput) as Record<string, unknown>;

      if (parsed.slug) setValue("slug", String(parsed.slug));
      if (parsed.title) setValue("title", String(parsed.title));
      if (parsed.summary) setValue("summary", String(parsed.summary));
      if (parsed.excerpt) setValue("excerpt", String(parsed.excerpt));
      if (parsed.type) setValue("type", parsed.type as ContentType);
      if (parsed.status) setValue("status", parsed.status as ContentStatus);
      if (parsed.isFeatured !== undefined)
        setValue("isFeatured", Boolean(parsed.isFeatured));
      if (parsed.publishedAt)
        setValue(
          "publishedAt",
          String(parsed.publishedAt).split("T")[0],
        );
      if (parsed.metaTitle) setValue("metaTitle", String(parsed.metaTitle));
      if (parsed.metaDescription)
        setValue("metaDescription", String(parsed.metaDescription));
      if (parsed.heroImage) setValue("heroImage", String(parsed.heroImage));
      if (parsed.heroImageAlt)
        setValue("heroImageAlt", String(parsed.heroImageAlt));

      // Sections
      if (Array.isArray(parsed.sections)) {
        const secs = (
          parsed.sections as Array<{
            heading?: string;
            body?: string;
            sortOrder?: number;
          }>
        ).map((s, i) => ({
          heading: s.heading ?? "",
          body: s.body ?? "",
          sortOrder: s.sortOrder ?? i + 1,
        }));
        setValue("sections", secs);
      }

      // Tags — accept string[] or comma-separated string
      if (Array.isArray(parsed.tags)) {
        setValue("tags", (parsed.tags as string[]).join(", "));
      } else if (typeof parsed.tags === "string") {
        setValue("tags", parsed.tags);
      }

      setActiveTab("basic");
    } catch {
      setJsonError("Invalid JSON — please check the format and try again.");
    }
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────

  const buildSections = (
    sections: SectionFormValue[],
  ): IContentSectionPayload[] =>
    sections.map((s, i) => ({
      heading: s.heading || null,
      body: s.body,
      sortOrder: s.sortOrder ?? i + 1,
    }));

  const buildTags = (tagsStr: string): IContentTagPayload[] =>
    tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((value) => ({ value }));

  const onSubmit = async (data: ArticleFormValues) => {
    const sections = buildSections(data.sections);
    const tags = buildTags(data.tags);

    if (isEditing) {
      const payload: IUpdateContentArticlePayload = {
        slug: data.slug,
        title: data.title,
        summary: data.summary || null,
        excerpt: data.excerpt || null,
        type: data.type,
        status: data.status,
        publishedAt: data.publishedAt || null,
        isFeatured: data.isFeatured ? 1 : 0,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        heroImage: data.heroImage || null,
        heroImageAlt: data.heroImageAlt || null,
        sections,
        tags,
      };
      updateArticle.mutate(payload, {
        onSuccess: () => navigate("/content-articles"),
      });
    } else {
      const payload: ICreateContentArticlePayload = {
        slug: data.slug,
        title: data.title,
        summary: data.summary || null,
        excerpt: data.excerpt || null,
        type: data.type,
        status: data.status,
        publishedAt: data.publishedAt || null,
        isFeatured: data.isFeatured ? 1 : 0,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        heroImage: data.heroImage || null,
        heroImageAlt: data.heroImageAlt || null,
        sections,
        tags,
      };
      createArticle.mutate(payload, {
        onSuccess: () => navigate("/content-articles"),
      });
    }
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
        title={isEditing ? "Edit Article" : "New Article"}
        description={
          isEditing
            ? "Update article details"
            : "Create a new content article"
        }
        actions={
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate("/content-articles")}
          >
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Basic Info ────────────────────────────────────────────── */}
        {activeTab === "basic" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Title *"
                  placeholder="Article title"
                  error={errors.title?.message}
                  {...register("title", { required: "Title is required" })}
                />
                <Input
                  label="Slug *"
                  placeholder="article-slug"
                  error={errors.slug?.message}
                  {...register("slug", { required: "Slug is required" })}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  label="Type *"
                  options={typeOptions}
                  error={errors.type?.message}
                  {...register("type", { required: "Type is required" })}
                />
                <Select
                  label="Status"
                  options={statusOptions}
                  {...register("status")}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Hero Image URL"
                  placeholder="https://example.com/image.jpg"
                  {...register("heroImage")}
                />
                <Input
                  label="Hero Image Alt Text"
                  placeholder="Descriptive alt text"
                  {...register("heroImageAlt")}
                />
              </div>

              <Input
                label="Published At"
                type="date"
                {...register("publishedAt")}
              />

              <Toggle
                label="Featured Article"
                {...register("isFeatured")}
              />

              <Textarea
                label="Excerpt"
                placeholder="Short description shown in listings..."
                rows={2}
                {...register("excerpt")}
              />

              <Textarea
                label="Summary / Body"
                placeholder="Full article content (markdown supported)..."
                rows={10}
                {...register("summary")}
              />
            </CardContent>
          </Card>
        )}

        {/* ── Tab: SEO ──────────────────────────────────────────────────── */}
        {activeTab === "seo" && (
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Meta Title"
                placeholder="SEO title (50–60 chars recommended)"
                {...register("metaTitle")}
              />
              <Textarea
                label="Meta Description"
                placeholder="SEO description (120–160 chars recommended)"
                rows={3}
                {...register("metaDescription")}
              />
            </CardContent>
          </Card>
        )}

        {/* ── Tab: Sections ─────────────────────────────────────────────── */}
        {activeTab === "sections" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Content Sections</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() =>
                    appendSection({
                      heading: "",
                      body: "",
                      sortOrder: sectionFields.length + 1,
                    })
                  }
                >
                  Add Section
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {sectionFields.length === 0 ? (
                <p className="text-center text-sm text-slate-500 py-6">
                  No sections yet. Click "Add Section" to get started.
                </p>
              ) : (
                sectionFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Section {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <div className="sm:col-span-3">
                          <Input
                            label="Heading"
                            placeholder="Optional section heading"
                            {...register(`sections.${index}.heading`)}
                          />
                        </div>
                        <Input
                          label="Sort Order"
                          type="number"
                          {...register(`sections.${index}.sortOrder`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <Textarea
                        label="Body *"
                        placeholder="Section body content (markdown supported)"
                        rows={5}
                        error={
                          errors.sections?.[index]?.body?.message
                        }
                        {...register(`sections.${index}.body`, {
                          required: "Body is required",
                        })}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Tab: Tags ─────────────────────────────────────────────────── */}
        {activeTab === "tags" && (
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                label="Tags (comma-separated)"
                placeholder="tech, review, smartphone, 2025"
                rows={3}
                {...register("tags")}
              />
              <p className="mt-1 text-xs text-slate-500">
                Enter tags separated by commas, e.g.{" "}
                <code>tech, review, guide</code>
              </p>
            </CardContent>
          </Card>
        )}

        {/* ── Tab: JSON Import ──────────────────────────────────────────── */}
        {activeTab === "json" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                Import Article from JSON
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="info">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Paste a JSON object to populate the form. Existing form
                  values will be overwritten. The article will remain in{" "}
                  <strong>Draft</strong> status unless specified.
                </span>
              </Alert>

              {jsonError && (
                <Alert variant="error">
                  <AlertCircle className="h-4 w-4" />
                  <span>{jsonError}</span>
                </Alert>
              )}

              <textarea
                className="w-full rounded-lg border border-slate-200 p-3 font-mono text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={20}
                placeholder="Paste your JSON here..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
              />

              <div className="flex gap-2">
                <Button type="button" onClick={handleJsonImport}>
                  Import JSON
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setJsonInput(JSON_TEMPLATE)}
                >
                  Load Template
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setJsonInput("");
                    setJsonError(null);
                  }}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Save Button ───────────────────────────────────────────────── */}
        {activeTab !== "json" && (
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/content-articles")}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {isEditing ? "Save Changes" : "Create Article"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
