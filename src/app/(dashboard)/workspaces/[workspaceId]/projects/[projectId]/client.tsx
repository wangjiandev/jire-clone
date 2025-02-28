'use client'

import Link from 'next/link'
import PageLoading from '@/components/page-loading'
import ProjectAvatar from '@/features/projects/components/project-avatar'
import PageError from '@/components/page-error'
import TaskViewSwitcher from '@/features/tasks/components/task-view-switcher'
import { Button } from '@/components/ui/button'
import { PencilIcon } from 'lucide-react'
import { useProjectId } from '@/features/projects/hooks/use-project-id'
import { useGetProject } from '@/features/projects/api/use-get-project'

const ProjectIdClient = async () => {
  const projectId = useProjectId()
  const { data, isLoading } = useGetProject({ projectId })

  if (isLoading) return <PageLoading />
  if (!data) return <PageError message="Failed to fetch project" />

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar name={data.name} image={data.imageUrl} className="size-8" />
          <p className="text-lg font-semibold">{data.name}</p>
        </div>
        <div>
          <Button variant="secondary" asChild>
            <Link href={`/workspaces/${data.workspaceId}/projects/${data.$id}/settings`}>
              <PencilIcon className="size-5" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher hideProjectFilter />
    </div>
  )
}

export default ProjectIdClient
