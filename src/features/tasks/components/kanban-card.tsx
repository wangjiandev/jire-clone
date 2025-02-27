import { MoreHorizontal } from 'lucide-react'
import { Task } from '../types'
import TaskAction from './task-action'
import { Separator } from '@/components/ui/separator'
import MemberAvatar from '@/features/members/components/member-avatar'
import TaskDate from './task-date'
import ProjectAvatar from '@/features/projects/components/project-avatar'

interface KanbanCardProps {
  task: Task
}

const KanbanCard = ({ task }: KanbanCardProps) => {
  return (
    <div className="mb-1.5 space-y-3 rounded bg-white p-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-x-2">
        <p className="line-clamp-2 text-sm">{task.name}</p>
        <TaskAction id={task.$id} projectId={task.projectId}>
          <MoreHorizontal className="size-[18px] shrink-0 stroke-1 text-neutral-700 transition hover:opacity-75" />
        </TaskAction>
      </div>
      <Separator className="my-2" />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar name={task.assignee.name} fallbackClassName="text-[10px]" />
        <Separator orientation="vertical" className="h-4" />
        <TaskDate className="text-xs" value={task.dueDate} />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar name={task.project.name} image={task.project.imageUrl} fallbackClassName="text-[10px]" />
        <span className="text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  )
}

export default KanbanCard
