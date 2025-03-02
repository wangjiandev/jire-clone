'use client'

import UserButton from '@/features/auth/components/user-button'
import MobileSidebar from './mobile-sidebar'
import { usePathname } from 'next/navigation'

const pathnameMap = {
  tasks: {
    title: 'My Tasks',
    description: 'Monitor all of your project and tags',
  },
  projects: {
    title: 'My Projects',
    description: 'Monitor all of your projects',
  },
}

const defaultMap = {
  title: 'Home',
  description: 'Monitor all of your project and tags',
}

const Navbar = () => {
  const pathname = usePathname()
  const pathnameParts = pathname.split('/')
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap

  const { title, description } = pathnameMap[pathnameKey] ?? defaultMap

  return (
    <nav className="flex items-center justify-between px-6 pt-4">
      <div className="hidden flex-col lg:flex">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  )
}

export default Navbar
