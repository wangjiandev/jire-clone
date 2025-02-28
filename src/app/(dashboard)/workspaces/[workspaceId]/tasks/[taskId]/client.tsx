'use client'

import PageError from '@/components/page-error'
import PageLoading from '@/components/page-loading'
import { Separator } from '@/components/ui/separator'
import { useGetTask } from '@/features/tasks/api/use-get-task'
import { useTaskId } from '@/features/tasks/hooks/use-task-id'
import TaskBreadcrumbs from '@/features/tasks/components/task-breadcrumbs'
import TaskDescription from '@/features/tasks/components/task-description'
import TaskOverview from '@/features/tasks/components/task-overview'

const TaskIdClient = () => {
  const taskId = useTaskId()
  const { data, isLoading } = useGetTask({ taskId })

  if (isLoading) return <PageLoading />
  if (!data) return <PageError message="Failed to fetch task" />

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={data.project} task={data} />
      <Separator />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  )
}

export default TaskIdClient
