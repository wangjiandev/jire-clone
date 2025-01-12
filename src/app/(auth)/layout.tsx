'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const isSignUp = pathname === '/sign-up'
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Image src="/logo.svg" alt="logo" width={143} height={28} />
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary">
              <Link href={isSignUp ? '/sign-in' : '/sign-up'}>{isSignUp ? 'Sign In' : 'Sign Up'}</Link>
            </Button>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">{children}</div>
      </div>
    </main>
  )
}

export default AuthLayout
