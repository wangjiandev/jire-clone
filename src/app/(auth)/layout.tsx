import { Button } from '@/components/ui/button'
import Image from 'next/image'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Image src="/logo.svg" alt="logo" width={100} height={50} />
          <div className="flex items-center gap-2">
            <Button variant="secondary">Sign Up</Button>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">{children}</div>
      </div>
    </main>
  )
}

export default AuthLayout