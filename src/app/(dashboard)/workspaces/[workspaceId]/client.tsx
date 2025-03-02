'use client'

import Analytics from '@/components/analytics'
import PageError from '@/components/page-error'
import PageLoading from '@/components/page-loading'
import { Button } from '@/components/ui/button'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetProjects } from '@/features/projects/api/use-get-projects'
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal'
import { useGetTasks } from '@/features/tasks/api/use-get-tasks'
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal'
import { Task } from '@/features/tasks/types'
import { useGetWorkspaceAnalytics } from '@/features/workspaces/api/use-get-workspace-analytics'
import { Calendar, Plus, Settings } from 'lucide-react'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Project } from '@/features/projects/types'
import ProjectAvatar from '@/features/projects/components/project-avatar'
import { Member } from '@/features/members/types'
import MemberAvatar from '@/features/members/components/member-avatar'

const WorkspaceIdClient = async () => {
  const workspaceId = useWorkspaceId()
  const { data: analytics, isLoading: isLoadingAnalytics } = useGetWorkspaceAnalytics({ workspaceId })
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId })
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId })
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId })

  const isLoading = isLoadingAnalytics || isLoadingProjects || isLoadingTasks || isLoadingMembers
  if (isLoading) return <PageLoading />

  if (!analytics || !projects || !tasks || !members) return <PageError message="Failed to fetch workspace data" />

  return (
    <div className="flex h-full flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TaskList data={tasks} total={tasks.length} />
        <ProjectsList data={projects.documents ?? []} total={projects.total} />
        <MemberList data={members.documents ?? []} total={members.total} />
      </div>
    </div>
  )
}

export default WorkspaceIdClient

interface TaskListProps {
  data: Task[]
  total: number
}

const TaskList = ({ data, total }: TaskListProps) => {
  const workspaceId = useWorkspaceId()
  const { open: openCreateTaskModal } = useCreateTaskModal()

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <Button variant="outline" size="icon" onClick={openCreateTaskModal}>
            <Plus className="size-4" />
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map((task) => (
            <li key={task.id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="rounded-lg shadow-none transition hover:opacity-75">
                  <CardContent className="p-4">
                    <p className="truncate text-lg font-medium">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p>{task.project?.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300"></div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 size-1" />
                        <span className="truncate">{formatDistanceToNow(new Date(task.dueDate))}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="hidden text-center text-sm text-muted-foreground first-of-type:hidden">no tasks found</li>
        </ul>
        <Button variant="link" className="mt-4 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  )
}

interface ProjectsListProps {
  data: Project[]
  total: number
}

const ProjectsList = ({ data, total }: ProjectsListProps) => {
  const workspaceId = useWorkspaceId()
  const { open: openCreateProjectModal } = useCreateProjectModal()

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button variant="outline" size="icon" onClick={openCreateProjectModal}>
            <Plus className="size-4" />
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.map((project) => (
            <li key={project.id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="rounded-lg shadow-none transition hover:opacity-75">
                  <CardContent className="flex items-center gap-x-2.5 p-4">
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      className="size-12"
                      fallbackClassName="text-lg"
                    />
                    <p className="truncate text-lg font-medium">{project.name}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="hidden text-center text-sm text-muted-foreground first-of-type:hidden">no projects found</li>
        </ul>
      </div>
    </div>
  )
}

interface MemberListProps {
  data: Member[]
  total: number
}

const MemberList = ({ data, total }: MemberListProps) => {
  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button variant="outline" size="icon">
            <Settings className="size-4" />
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.map((member) => (
            <li key={member.id}>
              <Card className="overflow-hidden rounded-lg shadow-none">
                <CardContent className="flex flex-col items-center gap-x-2 p-3">
                  <MemberAvatar name={member.name} className="size-12" fallbackClassName="text-lg" />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="line-clamp-1 text-lg font-medium">{member.name}</p>
                    <p className="line-clamp-1 text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="hidden text-center text-sm text-muted-foreground first-of-type:hidden">no members found</li>
        </ul>
      </div>
    </div>
  )
}
