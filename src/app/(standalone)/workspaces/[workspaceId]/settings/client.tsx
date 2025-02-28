'use client'

import PageLoading from '@/components/page-loading'
import PageError from '@/components/page-error'
import EditWorkspaceForm from '@/features/workspaces/components/edit-workspace-form'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'

const WorkspaceIdSettingsClient = async () => {
  const workspaceId = useWorkspaceId()
  const { data, isLoading } = useGetWorkspace({ workspaceId })

  if (isLoading) return <PageLoading />
  if (!data) return <PageError message="Failed to fetch workspace" />

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={data} />
    </div>
  )
}

export default WorkspaceIdSettingsClient
