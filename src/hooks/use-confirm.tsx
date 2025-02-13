import { useState } from 'react'

const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {})

  const handleConfirm = () => {
    setIsOpen(false)
    onConfirm()
  }
}

export default useConfirm
