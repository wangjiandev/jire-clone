import { Card, CardContent } from '@/components/ui/card'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetProjects } from '@/features/projects/api/use-get-projects'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { useGetTask } from '@/features/tasks/api/use-get-task'
import { Loader2 } from 'lucide-react'
import EditTaskForm from './edit-task-form'

interface EditTaskFormWrapperProps {
  onCancel: () => void
  id: string
}

const EditTaskFormWrapper = ({ onCancel, id }: EditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId()

  const { data: initialValue, isLoading: isLoadingTask } = useGetTask({
    taskId: id,
  })

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  })
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  })

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }))

  const memberOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }))

  const loading = isLoadingProjects || isLoadingMembers || isLoadingTask

  if (loading) {
    return (
      <Card className="h-[714px] w-full border-none shadow-none">
        <CardContent className="flex h-full w-full items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!initialValue) {
    return null
  }

  return (
    <div>
      <EditTaskForm
        onCancel={onCancel}
        projectOptions={projectOptions ?? []}
        memberOptions={memberOptions ?? []}
        initialValue={initialValue}
      />
    </div>
  )
}

export default EditTaskFormWrapper
