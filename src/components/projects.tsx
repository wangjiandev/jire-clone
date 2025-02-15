'use client'

import Link from 'next/link'

import { cn } from '@/lib/utils'
import { useGetProjects } from '@/features/projects/api/use-get-projects'
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { usePathname } from 'next/navigation'
import { RiAddCircleFill } from 'react-icons/ri'

import ProjectAvatar from '@/features/projects/components/project-avatar'

const Projects = () => {
  const pathname = usePathname()
  const workspaceId = useWorkspaceId()
  const { open } = useCreateProjectModal()
  const { data } = useGetProjects({ workspaceId })

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75"
        />
      </div>
      {data?.documents.map((project) => {
        const href = `/workspace/${workspaceId}/projects/${project.$id}`
        const isActive = pathname === href
        return (
          <Link href={href} key={project.$id}>
            <div
              className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded-md p-2.5 transition hover:opacity-75',
                isActive && 'bg-white text-primary shadow-sm hover:opacity-100',
              )}>
              <ProjectAvatar image={project.imageUrl} name={project.name} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default Projects
