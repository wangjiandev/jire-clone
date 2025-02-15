'use client'

import ResponsiveModal from '@/components/ResponsiveModal'
import CreateProjectForm from '@/features/projects/components/create-project-form'
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal'

const CreateProjectModal = () => {
  const { isOpen, setIsOpen, close } = useCreateProjectModal()
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  )
}

export default CreateProjectModal
