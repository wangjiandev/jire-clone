import { getCurrent } from '@/features/auth/queries'
import JoinWorkspaceForm from '@/features/workspaces/components/join-workspace-form'
import { getWorkspaceInfo } from '@/features/workspaces/queries'
import { redirect } from 'next/navigation'

interface WorkspaceIdJoinPageProps {
    params: {
        workspaceId: string
    }
}

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
    const user = await getCurrent()
    if (!user) redirect('/sign-in')

    const workspace = await getWorkspaceInfo({ workspaceId: params.workspaceId })
    if (!workspace) redirect('/')

    return (
        <div className="w-full lg:max-w-2xl">
            <JoinWorkspaceForm initialValues={workspace} />
        </div>
    )
}

export default WorkspaceIdJoinPage
