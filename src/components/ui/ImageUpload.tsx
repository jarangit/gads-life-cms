import { useRef, useState, type ChangeEvent } from 'react'
import { clsx } from 'clsx'
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'

interface ImageUploadProps {
  label?: string
  value?: string
  onChange?: (url: string | null) => void
  error?: string
  hint?: string
  className?: string
  /** Allow external URL input */
  allowUrl?: boolean
}

export function ImageUpload({
  label,
  value,
  onChange,
  error,
  hint,
  className,
  allowUrl = true,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload to Cloudinary/S3 here
      // For now, we'll create a local URL
      const url = URL.createObjectURL(file)
      onChange?.(url)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      onChange?.(url)
    }
  }

  const handleRemove = () => {
    onChange?.(null)
    setUrlInput('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange?.(urlInput.trim())
      setUrlInput('')
    }
  }

  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleUrlSubmit()
    }
  }

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <img
              src={value}
              alt="Uploaded"
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Mode Toggle */}
          {allowUrl && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInputMode('upload')}
                className={clsx(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  inputMode === 'upload'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload
              </button>
              <button
                type="button"
                onClick={() => setInputMode('url')}
                className={clsx(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  inputMode === 'url'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                <LinkIcon className="h-3.5 w-3.5" />
                URL
              </button>
            </div>
          )}

          {/* Upload Mode */}
          {inputMode === 'upload' && (
            <div
              className={clsx(
                'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors',
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : error
                  ? 'border-red-300 bg-red-50'
                  : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                {dragActive ? (
                  <ImageIcon className="h-5 w-5 text-blue-500" />
                ) : (
                  <Upload className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <p className="text-sm text-slate-600">
                <span className="font-medium text-blue-600">Click to upload</span> or
                drag and drop
              </p>
              <p className="mt-1 text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* URL Mode */}
          {inputMode === 'url' && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={handleUrlKeyDown}
                  placeholder="https://example.com/image.jpg"
                  className={clsx(
                    'flex-1 rounded-lg border px-3 py-2 text-sm transition-colors outline-none',
                    error
                      ? 'border-red-300 bg-red-50 focus:border-red-500'
                      : 'border-slate-300 bg-white focus:border-blue-500'
                  )}
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Enter an external image URL and click Add
              </p>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      {hint && !error && (
        <p className="mt-1.5 text-sm text-slate-500">{hint}</p>
      )}
    </div>
  )
}
