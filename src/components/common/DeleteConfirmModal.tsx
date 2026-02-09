import { useState } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  isLoading?: boolean
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader onClose={onClose}>{title}</ModalHeader>
      <ModalBody>
        <p className="text-sm text-slate-600">{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  )
}

// Hook for managing delete modal state
export function useDeleteModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [itemId, setItemId] = useState<string | null>(null)

  const openModal = (id: string) => {
    setItemId(id)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setItemId(null)
  }

  return {
    isOpen,
    itemId,
    openModal,
    closeModal,
  }
}
