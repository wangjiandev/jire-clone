'use client'

import ResponsiveModal from '@/components/ResponsiveModal'
import CreateWorkspaceForm from './create-workspace-form'
import { useCreateWorkspaceModal } from '../hooks/use-create-workspace-modal'

const CreateWorkspaceModal = () => {
    const { isOpen, setIsOpen, close } = useCreateWorkspaceModal()
    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateWorkspaceForm onCancel={close} />
        </ResponsiveModal>
    )
}

export default CreateWorkspaceModal
