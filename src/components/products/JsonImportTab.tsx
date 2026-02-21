import { FileJson, AlertCircle } from "lucide-react";
import {
  Button,
  Alert,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";

interface JsonImportTabProps {
  jsonInput: string;
  jsonError: string | null;
  onJsonChange: (value: string) => void;
  onImport: () => void;
  onLoadTemplate: () => void;
  onClear: () => void;
}

const JSON_TEMPLATE = JSON.stringify(
  {
    name: "MacBook Air M3 form",
    subtitle: '15\" • 2024 • Space Gray',
    slug: "macbook-air-m3-15",
    categoryId: null,
    brandId: null,
    image: "https://example.com/macbook-air-m3.jpg",
    overallScore: 4.5,
    isRecommended: true,
    price: 44900,
    currency: "THB",
    priceLabel: "ราคาเริ่มต้น",
    affiliateLink: "https://affiliate.example.com/macbook",
    lastUpdated: "2026-02-16",
    status: "draft",
    ratings: [
      { subCategory: "Performance", score: 5 },
      { subCategory: "Battery", score: 5 },
      { subCategory: "Display", score: 4 },
      { subCategory: "Value", score: 4 },
    ],
    keyHighlights: [
      { content: "M3 Chip แรงขึ้น 60% จาก M1", sortOrder: 1 },
      { content: "แบตอึด 18 ชั่วโมง", sortOrder: 2 },
    ],
    weaknesses: [{ content: "Port แค่ 2 ช่อง USB-C", sortOrder: 1 }],
    beforePurchasePoints: [{ content: "กลัวว่าจะร้อนเกินไป", sortOrder: 1 }],
    afterUsagePoints: [{ content: "ไม่ร้อนเลย ใช้งานทั้งวันได้", sortOrder: 1 }],
    pros: [{ content: "แบตเตอรี่อึดมาก", sortOrder: 1 }],
    cons: [{ content: "ไม่เหมาะกับ Gaming", sortOrder: 1 }],
    quickVerdict: {
      quote: "แล็ปท็อปที่ดีที่สุดสำหรับคนทั่วไป",
      description: "MacBook Air M3 คือเครื่องที่เราแนะนำให้กับทุกคน",
    },
    quickVerdictTags: [{ tag: "Everyday Use", sortOrder: 1 }],
    pricing: {
      price: 44900,
      currency: "THB",
      priceLabel: "ราคาเริ่มต้น",
    },
    finalVerdictPoints: [
      { type: "BUY_IF", text: "ต้องการแล็ปท็อปที่ใช้งานได้ทุกวัน", orderIndex: 1 },
      { type: "SKIP_IF", text: "ต้องการเล่นเกม AAA", orderIndex: 1 },
    ],
  },
  null,
  2,
);

export function JsonImportTab({
  jsonInput,
  jsonError,
  onJsonChange,
  onImport,
  onLoadTemplate,
  onClear,
}: JsonImportTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileJson className="h-5 w-5" />
          Import Product from JSON
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="info">
          <AlertCircle className="h-4 w-4" />
          <span>
            Products imported via JSON will automatically be set to{" "}
            <strong>Draft</strong> status for review.
          </span>
        </Alert>

        {jsonError && (
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <span>{jsonError}</span>
          </Alert>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Paste JSON Data
          </label>
          <textarea
            className="h-80 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={jsonInput}
            onChange={(e) => onJsonChange(e.target.value)}
            placeholder={JSON_TEMPLATE}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onImport}
            leftIcon={<FileJson className="h-4 w-4" />}
          >
            Import & Review
          </Button>
          <Button type="button" variant="outline" onClick={onLoadTemplate}>
            Load Template
          </Button>
          <Button type="button" variant="ghost" onClick={onClear}>
            Clear
          </Button>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <h4 className="mb-2 text-sm font-medium text-slate-700">
            JSON Structure
          </h4>
          <ul className="space-y-1 text-sm text-slate-600">
            <li>
              <code className="rounded bg-slate-200 px-1">name</code> -
              Required. Product name
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">subtitle</code> -
              Short subtitle shown under title
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">slug</code> - URL slug
              (auto-generated if empty)
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">categoryId</code> /{" "}
              <code className="rounded bg-slate-200 px-1">categoryIds</code> -
              category id (single/array)
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">image</code> /{" "}
              <code className="rounded bg-slate-200 px-1">heroImage</code> -
              Product image URL
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">overallScore</code> /{" "}
              <code className="rounded bg-slate-200 px-1">rating</code> - score 0-5
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">affiliateLink</code> /{" "}
              <code className="rounded bg-slate-200 px-1">affiliateLinks</code> -
              affiliate source
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">quickVerdict</code>,{" "}
              <code className="rounded bg-slate-200 px-1">quickVerdictTags</code>,{" "}
              <code className="rounded bg-slate-200 px-1">pricing</code> - nested objects
            </li>
            <li>
              <code className="rounded bg-slate-200 px-1">finalVerdictPoints</code> -
              array of {"{type: BUY_IF|SKIP_IF, text, orderIndex}"}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export const getJsonTemplate = () => JSON_TEMPLATE;
