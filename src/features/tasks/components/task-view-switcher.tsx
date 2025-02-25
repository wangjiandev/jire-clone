'use client'

import { Loader2, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal'
import { useGetTasks } from '../api/use-get-tasks'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { useQueryState } from 'nuqs'

const TaskViewSwitcher = () => {
  const [view, setView] = useQueryState('view', { defaultValue: 'table' })
  const { open } = useCreateTaskModal()
  const workspaceId = useWorkspaceId()
  const { data: tasks, isLoading: isTasksLoading } = useGetTasks({
    workspaceId,
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
        {/* // TODO: Add filters */}
        data filters
        <Separator className="my-4" />
        {isTasksLoading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table">{JSON.stringify(tasks)}</TabsContent>
            <TabsContent value="kanban">{JSON.stringify(tasks)}</TabsContent>
            <TabsContent value="calendar">{JSON.stringify(tasks)}</TabsContent>
          </>
        )}
      </div>
    </Tabs>
  )
}

export default TaskViewSwitcher
