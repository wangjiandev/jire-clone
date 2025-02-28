'use client'

import EditProjectForm from '@/features/projects/components/edit-project-form'
import { useProjectId } from '@/features/projects/hooks/use-project-id'
import { useGetProject } from '@/features/projects/api/use-get-project'
import PageLoading from '@/components/page-loading'
import PageError from '@/components/page-error'

const ProjectIdSettingsClient = async () => {
  const projectId = useProjectId()
  const { data, isLoading } = useGetProject({ projectId })

  if (isLoading) return <PageLoading />
  if (!data) return <PageError message="Failed to fetch project" />

  return (
    <div className="m-auto w-full lg:max-w-xl">
      <EditProjectForm initialValues={data} />
    </div>
  )
}

export default ProjectIdSettingsClient
