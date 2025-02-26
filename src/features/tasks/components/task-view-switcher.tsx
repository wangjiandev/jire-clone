'use client'

import { Loader2, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal'
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters'
import { useGetTasks } from '../api/use-get-tasks'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { useQueryState } from 'nuqs'
import DataFilters from './data-filters'
import { DataTable } from './data-table'
import { columns } from './columns'

const TaskViewSwitcher = () => {
  const [view, setView] = useQueryState('view', { defaultValue: 'table' })
  const { open } = useCreateTaskModal()
  const workspaceId = useWorkspaceId()

  const [{ projectId, status, assigneeId, dueDate }] = useTaskFilters()

  const { data: tasks, isLoading: isTasksLoading } = useGetTasks({
    workspaceId,
    projectId,
    status,
    assigneeId,
    dueDate,
  })

  return (
    <Tabs defaultValue={view} onValueChange={setView} className="w-full flex-1 rounded-lg border">
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="size-4" />
            New
          </Button>
        </div>
        <Separator className="my-4" />
        <DataFilters />
        <Separator className="my-4" />
        {isTasksLoading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="w-full lg:w-auto">
              <div className="w-full lg:w-auto">{JSON.stringify(tasks)}</div>
            </TabsContent>
            <TabsContent value="calendar" className="w-full lg:w-auto">
              <div className="w-full lg:w-auto">{JSON.stringify(tasks)}</div>
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  )
}

export default TaskViewSwitcher
