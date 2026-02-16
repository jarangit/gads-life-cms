import { useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, FileJson, Lock } from "lucide-react";
import {
  Button,
  Select,
  ImageUpload,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";
import { PageHeader } from "@/components/common";
import {
  BasicInfoTab,
  ProsConsTab,
  SpecsTab,
  AffiliateLinksTab,
  JsonImportTab,
  ProductDetailsTab,
  getJsonTemplate,
  // Read-only versions
  ReadOnlyProductDetails,
  ReadOnlyProsCons,
  ReadOnlySpecs,
  ReadOnlyAffiliateLinks,
} from "@/components/products";
import { useProductForm } from "@/hooks";
import { statusOptions } from "@/mocks/products";
import {
  type ProductTabId,
  isTabEditable,
  getVisibleTabs,
} from "@/config/editableFields";

const allTabs: { id: ProductTabId; label: string; icon?: React.ReactNode }[] = [
  { id: "basic", label: "Basic Info" },
  { id: "details", label: "Product Details" },
  { id: "content", label: "Pros & Cons" },
  { id: "specs", label: "Specifications" },
  { id: "links", label: "Affiliate Links" },
  { id: "json", label: "Import JSON", icon: <FileJson className="h-4 w-4" /> },
];

export function ProductFormPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<ProductTabId>("basic");
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const {
    formData,
    errors,
    isLoading,
    isSaving,
    isEditing,
    handleChange,
    updateField,
    handleSubmit,
    handleSaveAndPublish,
    handleProChange,
    addPro,
    removePro,
    handleConChange,
    addCon,
    removeCon,
    handleSpecChange,
    addSpec,
    removeSpec,
    handleLinkChange,
    addLink,
    removeLink,
    toggleCategory,
    keyHighlightsHandlers,
    weaknessesHandlers,
    beforePurchaseHandlers,
    afterUsageHandlers,
    verdictTagsHandlers,
    handleRatingItemChange,
    addRating,
    removeRating,
    importFromJson,
    navigate,
  } = useProductForm(id);

  const handleJsonImport = () => {
    setJsonError(null);
    const error = importFromJson(jsonInput);
    if (error) {
      setJsonError(error);
    } else {
      setActiveTab("basic");
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
        title={isEditing ? "Edit Product" : "New Product"}
        description={
          isEditing ? "Update product review" : "Create a new product review"
        }
        actions={
          <Button
            variant="ghost"
            onClick={() => navigate("/products")}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-slate-200">
              <nav className="-mb-px flex gap-6">
                {getVisibleTabs(allTabs, isEditing).map((tab) => {
                  const isReadOnly = !isTabEditable(tab.id, isEditing);
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                      {isReadOnly && (
                        <Lock className="h-3 w-3 text-slate-400" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "basic" && (
              <BasicInfoTab
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onCategoryToggle={toggleCategory}
                onPriceChange={(value) => updateField("price", value)}
                onRatingChange={(value) => updateField("rating", value)}
              />
            )}

            {activeTab === "details" && (
              isTabEditable("details", isEditing) ? (
                <ProductDetailsTab
                  formData={formData}
                  keyHighlightsHandlers={keyHighlightsHandlers}
                  weaknessesHandlers={weaknessesHandlers}
                  beforePurchaseHandlers={beforePurchaseHandlers}
                  afterUsageHandlers={afterUsageHandlers}
                  verdictTagsHandlers={verdictTagsHandlers}
                  handleRatingItemChange={handleRatingItemChange}
                  addRating={addRating}
                  removeRating={removeRating}
                  updateField={updateField as (field: string, value: unknown) => void}
                />
              ) : (
                <ReadOnlyProductDetails formData={formData} />
              )
            )}

            {activeTab === "content" && (
              isTabEditable("content", isEditing) ? (
                <ProsConsTab
                  pros={formData.pros}
                  cons={formData.cons}
                  onProChange={handleProChange}
                  onAddPro={addPro}
                  onRemovePro={removePro}
                  onConChange={handleConChange}
                  onAddCon={addCon}
                  onRemoveCon={removeCon}
                />
              ) : (
                <ReadOnlyProsCons pros={formData.pros} cons={formData.cons} />
              )
            )}

            {activeTab === "specs" && (
              isTabEditable("specs", isEditing) ? (
                <SpecsTab
                  specs={formData.specs}
                  onSpecChange={handleSpecChange}
                  onAddSpec={addSpec}
                  onRemoveSpec={removeSpec}
                />
              ) : (
                <ReadOnlySpecs specs={formData.specs} />
              )
            )}

            {activeTab === "links" && (
              isTabEditable("links", isEditing) ? (
                <AffiliateLinksTab
                  links={formData.affiliateLinks}
                  onLinkChange={handleLinkChange}
                  onAddLink={addLink}
                  onRemoveLink={removeLink}
                />
              ) : (
                <ReadOnlyAffiliateLinks links={formData.affiliateLinks} />
              )
            )}

            {activeTab === "json" && (
              <JsonImportTab
                jsonInput={jsonInput}
                jsonError={jsonError}
                onJsonChange={setJsonInput}
                onImport={handleJsonImport}
                onLoadTemplate={() => setJsonInput(getJsonTemplate())}
                onClear={() => {
                  setJsonInput("");
                  setJsonError(null);
                }}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={statusOptions}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hero Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.heroImage}
                  onChange={(url) => updateField("heroImage", url || "")}
                  hint="Recommended: 1200x800px"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <Button type="submit" isLoading={isSaving} className="w-full">
                    {isEditing ? "Update Product" : "Save as Draft"}
                  </Button>
                  {formData.status === "draft" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveAndPublish}
                      isLoading={isSaving}
                      className="w-full"
                    >
                      Save & Publish
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/products")}
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
