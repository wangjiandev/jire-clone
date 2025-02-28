import Link from 'next/link'
import ProjectAvatar from '@/features/projects/components/project-avatar'
import { Project } from '@/features/projects/types'
import { Task } from '@/features/tasks/types'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { ChevronRightIcon, MoreHorizontalIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDeleteTask } from '../api/use-delete-task'
import useConfirm from '@/hooks/use-confirm'
import { useRouter } from 'next/navigation'

interface TaskBreadcrumbsProps {
  project: Project
  task: Task
}

const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const workspaceId = useWorkspaceId()
  const { mutate: deleteTask, isPending: deleteTaskLoading } = useDeleteTask()
  const [confirm, ConfirmationDialog] = useConfirm('Delete Task', 'This action cannot be undone.', 'destructive')
  const router = useRouter()

  const handleDeleteTask = async () => {
    const ok = await confirm()
    if (!ok) return
    deleteTask(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => router.push(`/workspaces/${workspaceId}/tasks`),
      },
    )
  }
  return (
    <div className="flex items-center gap-x-2">
      <ConfirmationDialog />
      <ProjectAvatar name={project.name} image={project.imageUrl} className="size-6 lg:size-8" />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm font-medium text-muted-foreground transition hover:opacity-75 lg:text-lg">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 text-muted-foreground lg:size-5" />
      <p className="text-sm font-semibold lg:text-lg">{task.name}</p>
      <Button className="ml-auto" variant="ghost" onClick={handleDeleteTask} disabled={deleteTaskLoading}>
        <TrashIcon className="size-4 text-muted-foreground lg:mr-2 lg:size-5" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  )
}

export default TaskBreadcrumbs
