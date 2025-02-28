import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetProjects } from '@/features/projects/api/use-get-projects'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ListCheckIcon, UserIcon, FolderIcon } from 'lucide-react'
import { useTaskFilters } from '../hooks/use-task-filters'
import { TaskStatus } from '../types'
import DatePicker from '@/components/date-picker'

interface DataFiltersProps {
  hideProjectFilter?: boolean
}

const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId()
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId })
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId })

  const isLoading = isLoadingProjects || isLoadingMembers

  const projectOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
  }))

  const memberOptions = members?.documents.map((member) => ({
    value: member.$id,
    label: member.name,
  }))

  const [{ projectId, status, assigneeId, dueDate }, setFilters] = useTaskFilters()

  const onStatusChange = (status: string) => {
    setFilters({ status: status === 'all' ? null : (status as TaskStatus) })
  }

  const onAssigneeChange = (assigneeId: string) => {
    setFilters({ assigneeId: assigneeId === 'all' ? null : assigneeId })
  }

  const onProjectChange = (projectId: string) => {
    setFilters({ projectId: projectId === 'all' ? null : projectId })
  }

  if (isLoading) return null

  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <Select defaultValue={status ?? 'all'} onValueChange={onStatusChange}>
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="mr-2 size-4" />
            <SelectValue placeholder="Filter by status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue={assigneeId ?? undefined} onValueChange={onAssigneeChange}>
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <UserIcon className="mr-2 size-4" />
            <SelectValue placeholder="Filter by assignee" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!hideProjectFilter && (
        <Select defaultValue={projectId ?? undefined} onValueChange={onProjectChange}>
          <SelectTrigger className="h-8 w-full lg:w-auto">
            <div className="flex items-center pr-2">
              <FolderIcon className="mr-2 size-4" />
              <SelectValue placeholder="Filter by project" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <DatePicker
        placeholder="Due Date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => setFilters({ dueDate: date?.toISOString() ?? null })}
      />
    </div>
  )
}

export default DataFilters
