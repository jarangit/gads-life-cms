# Gads Life CMS - AI Instructions

## Project Overview
This is an **Admin CMS** for a Product Review Website built with:
- **React 19** + **TypeScript**
- **Vite** as build tool
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **React Router v7** for routing
- **Lucide React** for icons
- **@dnd-kit** for drag-and-drop functionality
- **clsx** for conditional class names

## Project Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components (Button, Input, Card, etc.)
│   ├── common/       # Shared components (PageHeader, StatusBadge, etc.)
│   └── products/     # Product-specific components (form tabs)
├── hooks/            # Custom React hooks (useProductForm)
├── layouts/          # Layout components (AdminLayout)
├── mocks/            # Mock data for development
├── pages/            # Page components organized by module
├── types/            # TypeScript type definitions
└── utils/            # Utility functions (generateSlug, generateId)
```

## UI Component System

### Button Component
```tsx
<Button variant="primary|secondary|outline|ghost|danger" size="sm|md|lg" />
<Button leftIcon={<Icon />} rightIcon={<Icon />} isLoading />
```

### Input Component  
```tsx
<Input label="Label" error="Error message" hint="Hint text" />
```

### Card Component
```tsx
<Card>
  <CardHeader><CardTitle>Title</CardTitle></CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Other UI Components
- `Select` - Dropdown select
- `Textarea` - Multi-line text input
- `Modal` - Dialog modal
- `Alert` - Notification alert (variant: info|success|warning|error)
- `Badge` - Status badge
- `Table`, `Th`, `Td`, `Tr` - Table components
- `ImageUpload` - Image upload component
- `SearchInput` - Search input with icon
- `Pagination` - Pagination component
- `Toggle`, `Checkbox` - Form controls
- `EmptyState` - Empty state placeholder
- `LoadingSpinner` - Loading indicator

## Styling Conventions

### Color Palette (Tailwind)
- **Primary**: `blue-600` (hover: `blue-700`)
- **Secondary**: `slate-600` (hover: `slate-700`)  
- **Danger**: `red-600` (hover: `red-700`)
- **Background**: `slate-50`, `slate-100`
- **Text**: `slate-700`, `slate-500`, `slate-900`
- **Border**: `slate-200`, `slate-300`

### Spacing & Sizing
- Padding: `p-3`, `p-4`, `p-6`
- Gap: `gap-2`, `gap-3`, `gap-4`, `gap-6`
- Border radius: `rounded-lg`, `rounded-xl`

### Typography
- Headings: `text-lg font-semibold`, `text-xl font-semibold`
- Body: `text-sm`, `text-base`
- Labels: `text-sm font-medium text-slate-700`

## Code Patterns

### Page Component Pattern
```tsx
export function ModuleListPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  
  return (
    <div>
      <PageHeader
        title="Module Name"
        description="Description"
        actions={<Button onClick={() => navigate('/module/new')}>Add New</Button>}
      />
      {/* Content */}
    </div>
  )
}
```

### Form Page Pattern
```tsx
export function ModuleFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  const [formData, setFormData] = useState<FormData>({...})
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    // Save logic
  }
  
  return (
    <div>
      <PageHeader title={isEditing ? 'Edit' : 'New'} />
      <form onSubmit={handleSubmit}>
        {/* Form content */}
      </form>
    </div>
  )
}
```

### Custom Hook Pattern
```tsx
export function useModuleForm(id?: string) {
  const [formData, setFormData] = useState<FormData>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  
  // Handlers...
  
  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit,
  }
}
```

## Type Definitions

### Base Types
```typescript
interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

type ContentStatus = 'draft' | 'published' | 'archived'
```

### Entity Types
- `Category`: id, name, slug, parentId, description, coverImage, seo
- `Brand`: id, name, slug, logo, websiteUrl
- `Product`: id, name, slug, brandId, categoryIds, pros, cons, specs, affiliateLinks, status
- `Collection`: id, name, slug, description, items, status

## Import Conventions

### Path Aliases
```typescript
import { Button } from '@/components/ui'
import { PageHeader } from '@/components/common'
import { useProductForm } from '@/hooks'
import type { Product } from '@/types'
```

### Icon Imports
```typescript
import { ArrowLeft, Plus, Trash2, Search, Edit, Eye } from 'lucide-react'
```

## Best Practices

1. **Components**: Keep components small and focused. Extract to separate files when > 100 lines
2. **Hooks**: Extract complex state logic to custom hooks
3. **Types**: Define interfaces in `src/types/index.ts`
4. **Mocks**: Keep mock data in `src/mocks/` folder
5. **Forms**: Use controlled inputs with `useState` for form data
6. **Validation**: Validate on submit, show errors inline
7. **Navigation**: Use `useNavigate()` from react-router-dom
8. **Loading States**: Show spinner/skeleton during async operations

## File Naming
- Components: `PascalCase.tsx` (e.g., `ProductFormPage.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useProductForm.ts`)
- Types: `index.ts` in types folder
- Utils: `index.ts` in utils folder
