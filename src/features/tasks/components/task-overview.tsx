import { Button } from '@/components/ui/button'
import { Task } from '../types'
import { PencilIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import OverviewProperty from './overview-property'
import MemberAvatar from '@/features/members/components/member-avatar'
import TaskDate from './task-date'
import { Badge } from '@/components/ui/badge'
import { snakeCaseToTitleCase } from '@/lib/utils'
import { useEditTaskModal } from '../hooks/use-edit-task-modal'

interface TaskOverviewProps {
  task: Task
}

const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal()

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium">Overview</p>
          <Button onClick={() => open(task.$id)}>
            <PencilIcon className="mr-2 size-4" />
            Edit
          </Button>
        </div>
        <Separator className="my-4" />
        <p className="text-sm text-muted-foreground">{task.description}</p>
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assigned">
            <MemberAvatar name={task.assignee.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>{snakeCaseToTitleCase(task.status)}</Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  )
}

export default TaskOverview
