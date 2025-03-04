import Image from 'next/image'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import Navigation from '@/components/navigation'
import WorkspaceSwitcher from '@/components/workspace-switcher'
import Projects from '@/components/projects'

const Sidebar = () => {
  return (
    <aside className="h-full w-full bg-neutral-100 p-4">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={100} height={28} />
      </Link>
      <Separator className="my-4" />
      <WorkspaceSwitcher />
      <Separator className="my-4" />
      <Navigation />
      <Separator className="my-4" />
      <Projects />
    </aside>
  )
}

export default Sidebar
