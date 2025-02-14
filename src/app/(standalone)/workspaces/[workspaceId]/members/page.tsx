import { getCurrent } from '@/features/auth/queries'
import { redirect } from 'next/navigation'
import MembersList from '@/features/workspaces/components/members-list'

interface WorkspaceIdMembersPageProps {
  params: {
    workspaceId: string
  }
}

const WorkspaceIdMembersPage = async ({ params }: WorkspaceIdMembersPageProps) => {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  return (
    <div className="w-full lg:max-w-2xl">
      <MembersList />
    </div>
  )
}

export default WorkspaceIdMembersPage
