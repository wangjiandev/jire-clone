import useConfirm from '@/hooks/use-confirm'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { useDeleteTask } from '../api/use-delete-task'
import { useRouter } from 'next/navigation'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
interface TaskActionProps {
  id: string
  projectId: string
  children: React.ReactNode
}

const TaskAction = ({ id, projectId, children }: TaskActionProps) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const [confirm, ConfirmationDialog] = useConfirm('Delete Task', 'This action cannot be undone.', 'destructive')
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()

  const onDelete = async () => {
    const ok = await confirm()
    if (!ok) return
    deleteTask({ param: { taskId: id } })
  }

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`)
  }

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
  }

  const onEditTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}/edit`)
  }

  return (
    <div className="flex justify-end">
      <ConfirmationDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="p-[10px] font-medium" disabled={false} onClick={onOpenTask}>
            <ExternalLinkIcon className="mr-2 size-4 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem className="p-[10px] font-medium" disabled={false} onClick={onOpenProject}>
            <ExternalLinkIcon className="mr-2 size-4 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem className="p-[10px] font-medium" disabled={false} onClick={() => {}}>
            <PencilIcon className="mr-2 size-4 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            className="p-[10px] font-medium text-red-700 focus:text-red-700"
            disabled={isDeleting}
            onClick={onDelete}>
            <TrashIcon className="mr-2 size-4 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default TaskAction
