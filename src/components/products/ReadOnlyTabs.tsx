import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

/**
 * Read-only display components for product tabs
 * ใช้แสดงข้อมูลแบบอ่านอย่างเดียว ไม่สามารถแก้ไขได้
 */

// ─── Helper: Display list items ─────────────────────────

function ReadOnlyList({
  title,
  items,
  titleColor,
  emptyText = "ไม่มีข้อมูล",
}: {
  title: string;
  items: string[];
  titleColor?: string;
  emptyText?: string;
}) {
  const filteredItems = items.filter((item) => item.trim() !== "");

  return (
    <Card>
      <CardHeader>
        <CardTitle className={titleColor}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <p className="text-sm text-slate-400 italic">{emptyText}</p>
        ) : (
          <ul className="space-y-2">
            {filteredItems.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Read-only Product Details ──────────────────────────

interface ReadOnlyProductDetailsProps {
  formData: {
    keyHighlights: string[];
    weaknesses: string[];
    beforePurchasePoints: string[];
    afterUsagePoints: string[];
    quickVerdictQuote: string;
    quickVerdictDescription: string;
    quickVerdictTags: string[];
    pricingPrice?: number;
    pricingCurrency: string;
    pricingLabel: string;
    ratings: { subCategory: string; score: number }[];
    buyIfPoints: string[];
    skipIfPoints: string[];
  };
}

export function ReadOnlyProductDetails({ formData }: ReadOnlyProductDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.ratings.length === 0 ? (
            <p className="text-sm text-slate-400 italic">ไม่มีข้อมูล</p>
          ) : (
            <div className="space-y-2">
              {formData.ratings.map((r, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                >
                  <span className="text-sm text-slate-700">{r.subCategory}</span>
                  <span className="font-medium text-slate-900">{r.score}/5</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Highlights & Weaknesses */}
      <div className="grid gap-6 md:grid-cols-2">
        <ReadOnlyList
          title="Key Highlights"
          titleColor="text-emerald-600"
          items={formData.keyHighlights}
        />
        <ReadOnlyList
          title="Weaknesses"
          titleColor="text-amber-600"
          items={formData.weaknesses}
        />
      </div>

      {/* Before Purchase & After Usage */}
      <div className="grid gap-6 md:grid-cols-2">
        <ReadOnlyList
          title="Before Purchase Points"
          titleColor="text-blue-600"
          items={formData.beforePurchasePoints}
        />
        <ReadOnlyList
          title="After Usage Points"
          titleColor="text-indigo-600"
          items={formData.afterUsagePoints}
        />
      </div>

      {/* Quick Verdict */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-600">Quick Verdict</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.quickVerdictQuote ? (
            <blockquote className="border-l-4 border-purple-200 pl-4 italic text-slate-700">
              "{formData.quickVerdictQuote}"
            </blockquote>
          ) : (
            <p className="text-sm text-slate-400 italic">ไม่มี quote</p>
          )}
          {formData.quickVerdictDescription && (
            <p className="text-sm text-slate-600">
              {formData.quickVerdictDescription}
            </p>
          )}
          {formData.quickVerdictTags.filter((t) => t.trim()).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.quickVerdictTags
                .filter((t) => t.trim())
                .map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Price</p>
              <p className="text-lg font-semibold text-slate-900">
                {formData.pricingPrice?.toLocaleString() || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Currency</p>
              <p className="text-lg font-semibold text-slate-900">
                {formData.pricingCurrency || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Price Label</p>
              <p className="text-lg font-semibold text-slate-900">
                {formData.pricingLabel || "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <ReadOnlyList
          title="BUY IF"
          titleColor="text-emerald-600"
          items={formData.buyIfPoints}
        />
        <ReadOnlyList
          title="SKIP IF"
          titleColor="text-rose-600"
          items={formData.skipIfPoints}
        />
      </div>
    </div>
  );
}

// ─── Read-only Pros & Cons ──────────────────────────────

interface ReadOnlyProsConsProps {
  pros: string[];
  cons: string[];
}

export function ReadOnlyProsCons({ pros, cons }: ReadOnlyProsConsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ReadOnlyList title="Pros" titleColor="text-green-600" items={pros} />
      <ReadOnlyList title="Cons" titleColor="text-red-600" items={cons} />
    </div>
  );
}

// ─── Read-only Specs ────────────────────────────────────

interface ReadOnlySpecsProps {
  specs: { key: string; value: string }[];
}

export function ReadOnlySpecs({ specs }: ReadOnlySpecsProps) {
  const filteredSpecs = specs.filter((s) => s.key.trim() || s.value.trim());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredSpecs.length === 0 ? (
          <p className="text-sm text-slate-400 italic">ไม่มีข้อมูล</p>
        ) : (
          <div className="space-y-2">
            {filteredSpecs.map((spec, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
              >
                <span className="text-sm font-medium text-slate-600">
                  {spec.key}
                </span>
                <span className="text-sm text-slate-900">{spec.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Read-only Affiliate Links ──────────────────────────

interface ReadOnlyAffiliateLinksProps {
  links: { id: string; merchant: string; url: string; price?: number; note?: string }[];
}

export function ReadOnlyAffiliateLinks({ links }: ReadOnlyAffiliateLinksProps) {
  const filteredLinks = links.filter((l) => l.merchant || l.url);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affiliate Links</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredLinks.length === 0 ? (
          <p className="text-sm text-slate-400 italic">ไม่มีข้อมูล</p>
        ) : (
          <div className="space-y-3">
            {filteredLinks.map((link) => (
              <div
                key={link.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">
                    {link.merchant || "Unknown Merchant"}
                  </span>
                  {link.price && (
                    <span className="font-semibold text-green-600">
                      ${link.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {link.url && (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block truncate text-sm text-blue-600 hover:underline"
                  >
                    {link.url}
                  </a>
                )}
                {link.note && (
                  <p className="mt-1 text-sm text-slate-500">{link.note}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
