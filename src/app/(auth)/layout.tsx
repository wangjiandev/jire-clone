'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AuthLayoutProps {
    children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    const pathname = usePathname()
    const isSignIn = pathname === '/sign-in'
    return (
        <main className="flex min-h-screen flex-col">
            <div className="border-b border-gray-200">
                <nav className="mx-auto flex max-w-screen-2xl items-center justify-between p-4">
                    <Image src="/logo.svg" alt="logo" width={163} height={42} />
                    <div className="flex items-center gap-4">
                        <Button asChild variant="secondary">
                            <Link href={isSignIn ? '/sign-up' : '/sign-in'}>{isSignIn ? 'Register' : 'Login'}</Link>
                        </Button>
                    </div>
                </nav>
            </div>
            <div className="mx-auto flex w-screen max-w-screen-2xl flex-1 flex-col items-center px-4 pt-4 md:pt-14">
                {children}
            </div>
        </main>
    )
}

export default AuthLayout
