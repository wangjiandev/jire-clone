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
import { useGetProjectAnalytics } from '@/features/projects/api/use-get-project-analytics'
import Analytics from '@/components/analytics'

const ProjectIdClient = async () => {
  const projectId = useProjectId()
  const { data: project, isLoading: isProjectLoading } = useGetProject({ projectId })
  const { data: analytics, isLoading: isAnalyticsLoading } = useGetProjectAnalytics({ projectId })
  const isLoading = isProjectLoading || isAnalyticsLoading
  if (isLoading) return <PageLoading />
  if (!project) return <PageError message="Failed to fetch project" />

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar name={project.name} image={project.imageUrl} className="size-8" />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant="secondary" asChild>
            <Link href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}>
              <PencilIcon className="size-5" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analytics && <Analytics data={analytics} />}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  )
}

export default ProjectIdClient
