'use client'

import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces'
import { RiAddCircleFill } from 'react-icons/ri'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import WorkspacesAvatar from '@/features/workspaces/components/workspace-avatar'
import { useRouter } from 'next/navigation'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'

const WorkspaceSwitcher = () => {
  const workspaceId = useWorkspaceId()
  const route = useRouter()
  const { data } = useGetWorkspaces()

  const onSelect = (id: string) => {
    route.push(`/workspaces/${id}`)
  }
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75" />
      </div>

      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="h-14 w-full bg-neutral-200 p-2 font-medium">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {data?.documents.map((workspace) => (
            <SelectItem value={workspace.$id} key={workspace.$id}>
              <div className="flex items-center justify-start gap-3 font-medium">
                <WorkspacesAvatar name={workspace.name} image={workspace.imageUrl} />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default WorkspaceSwitcher
