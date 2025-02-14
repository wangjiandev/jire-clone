'use client'

import { useGetProjects } from '@/features/projects/api/use-get-projects'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RiAddCircleFill } from 'react-icons/ri'

const Projects = () => {
  const pathname = usePathname()
  const workspaceId = useWorkspaceId()
  const { data } = useGetProjects({ workspaceId })
  const projectId = null

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          onClick={() => {}}
          className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75"
        />
      </div>
      {data?.documents.map((project) => {
        const href = `/workspace/${workspaceId}/projects/${projectId}`
        const isActive = pathname === href
        return (
          <Link href={href} key={project.$id}>
            <div
              className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-md p-2.5 transition hover:opacity-75',
                isActive && 'bg-white text-primary shadow-sm hover:opacity-100',
              )}>
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default Projects
