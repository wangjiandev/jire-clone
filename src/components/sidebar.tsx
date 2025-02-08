import Image from 'next/image'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import Navigation from '@/components/navigation'

const Sidebar = () => {
  return (
    <aside className="h-full w-full bg-neutral-100 p-4">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={163} height={42} />
      </Link>
      <Separator className="my-4" />
      <Navigation />
    </aside>
  )
}

export default Sidebar
