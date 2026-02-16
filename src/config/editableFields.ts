/**
 * Editable Fields Configuration
 * 
 * กำหนดว่า field/tab ไหน edit ได้ใน edit mode
 * ถ้าต้องการเปิด/ปิด edit ให้แก้ที่ไฟล์นี้เพียงที่เดียว
 */

export type ProductTabId = "basic" | "details" | "content" | "specs" | "links" | "json";

/**
 * Config สำหรับกำหนดว่า tab ไหน editable ใน edit mode
 * - true = แก้ไขได้
 * - false = แสดงผลอย่างเดียว (read-only)
 */
export const EDITABLE_TABS_CONFIG: Record<ProductTabId, boolean> = {
  basic: true,      // Name, Slug, Image, Category, Brand - แก้ไขได้
  details: false,   // Product Details - read-only
  content: false,   // Pros & Cons - read-only
  specs: false,     // Specifications - read-only
  links: false,     // Affiliate Links - read-only
  json: false,      // Import JSON - ซ่อนใน edit mode
};

/**
 * Payload fields ที่อนุญาตให้ส่งไป API เมื่อ edit
 * ถ้าต้องการเพิ่ม/ลด field ที่ edit ได้ ให้แก้ที่นี่
 */
export const EDITABLE_PAYLOAD_FIELDS = [
  // Basic Info fields
  "name",
  "subtitle",      // shortDescription maps to subtitle
  "categoryId",
  "brandId",
  "image",         // heroImage maps to image
  "status",
] as const;

export type EditablePayloadField = (typeof EDITABLE_PAYLOAD_FIELDS)[number];

/**
 * ตรวจสอบว่า field นี้ editable หรือไม่
 */
export function isFieldEditable(fieldName: string): boolean {
  return EDITABLE_PAYLOAD_FIELDS.includes(fieldName as EditablePayloadField);
}

/**
 * Tabs ที่ควรซ่อนใน edit mode (ไม่แสดง tab เลย)
 */
export const HIDDEN_TABS_IN_EDIT_MODE: ProductTabId[] = ["json"];

/**
 * Helper function: ตรวจสอบว่า tab นี้ editable หรือไม่
 */
export function isTabEditable(tabId: ProductTabId, isEditMode: boolean): boolean {
  if (!isEditMode) return true; // ถ้าเป็น create mode ทุก tab แก้ไขได้
  return EDITABLE_TABS_CONFIG[tabId];
}

/**
 * Helper function: ตรวจสอบว่า tab นี้ควรแสดงหรือไม่
 */
export function shouldShowTab(tabId: ProductTabId, isEditMode: boolean): boolean {
  if (!isEditMode) return true;
  return !HIDDEN_TABS_IN_EDIT_MODE.includes(tabId);
}

/**
 * Helper function: ดึง tabs ที่ควรแสดงตาม mode
 */
export function getVisibleTabs<T extends { id: ProductTabId }>(
  tabs: T[],
  isEditMode: boolean
): T[] {
  if (!isEditMode) return tabs;
  return tabs.filter((tab) => shouldShowTab(tab.id, isEditMode));
}
