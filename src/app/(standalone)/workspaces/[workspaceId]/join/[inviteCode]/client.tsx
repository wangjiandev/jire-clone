'use client'

import PageError from '@/components/page-error'
import PageLoading from '@/components/page-loading'
import JoinWorkspaceForm from '@/features/workspaces/components/join-workspace-form'
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'

const WorkspaceIdJoinClient = async () => {
  const workspaceId = useWorkspaceId()
  const { data, isLoading } = useGetWorkspaceInfo({ workspaceId })

  if (isLoading) return <PageLoading />
  if (!data) return <PageError message="Failed to fetch workspace" />

  return (
    <div className="w-full lg:max-w-2xl">
      <JoinWorkspaceForm initialValues={data} />
    </div>
  )
}

export default WorkspaceIdJoinClient
