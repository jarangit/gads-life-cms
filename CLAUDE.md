# CLAUDE.md - Project Context for AI Assistants

## Quick Reference

**Stack**: React 19 + TypeScript + Vite + Tailwind CSS v4

**Commands**:
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
```

**Key Directories**:
- `src/components/ui/` - Reusable UI components
- `src/components/common/` - Shared components
- `src/hooks/` - Custom hooks
- `src/pages/` - Page components
- `src/types/` - TypeScript types

## UI Style Summary

| Element | Style |
|---------|-------|
| Primary Color | `blue-600` |
| Text | `slate-700` / `slate-500` |
| Background | `white` / `slate-50` |
| Border | `slate-200` / `slate-300` |
| Border Radius | `rounded-lg` |
| Focus Ring | `focus:ring-2 focus:ring-blue-500` |

## Component Usage

```tsx
// Buttons
<Button variant="primary">Save</Button>
<Button variant="outline" leftIcon={<ArrowLeft />}>Back</Button>

// Form inputs
<Input label="Name" error={errors.name} />
<Select label="Status" options={statusOptions} />
<Textarea label="Description" rows={3} />

// Cards
<Card>
  <CardHeader><CardTitle>Title</CardTitle></CardHeader>
  <CardContent>...</CardContent>
</Card>

// Layout
<PageHeader title="Page Title" actions={<Button>Action</Button>} />

// Stats Summary (Mini Dashboard)
<StatsSummary 
  stats={[
    { label: 'Total', value: 10, icon: <Package />, color: 'blue' },
    { label: 'Published', value: 5, icon: <CheckCircle />, color: 'green' },
  ]} 
  className="mb-6 grid-cols-3" 
/>
```

## Coding Conventions

1. Use `clsx()` for conditional classes
2. Use `lucide-react` for icons
3. Use path alias `@/` for imports
4. Keep components under 200 lines
5. Extract hooks for complex state logic
6. Types in `src/types/index.ts`

See `.github/copilot-instructions.md` for detailed documentation.
