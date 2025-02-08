import UserButton from '@/features/auth/components/user-button'
import MobileSidebar from './mobile-sidebar'

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 pt-4">
      <div className="hidden flex-col lg:flex">
        <h1 className="text-xl font-semibold">Home</h1>
        <p className="text-xs text-muted-foreground">Monitor all of your project and tags</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  )
}

export default Navbar
