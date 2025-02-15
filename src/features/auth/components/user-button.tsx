'use client'

import { Loader, LogOut } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

import { useCurrent } from '../api/use-current'
import { useLogout } from '../api/use-logout'

const UserButton = () => {
    const { data: user, isLoading } = useCurrent()
    const { mutate: logout } = useLogout()

    if (isLoading) {
        return (
            <div className="flex size-10 items-center justify-center rounded-full">
                <Loader className="size-4 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!user) {
        return null
    }

    const { name, email } = user

    const avatarFallback = name ? name.charAt(0).toUpperCase() : (email.charAt(0).toUpperCase() ?? 'U')

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="relative outline-none">
                <Avatar className="size-10 border border-neutral-300 transition hover:opacity-75">
                    <AvatarFallback className="flex items-center justify-center bg-neutral-200 font-medium text-neutral-500">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" className="w-60" sideOffset={10}>
                <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
                    <Avatar className="size-[52px] border border-neutral-300 transition hover:opacity-75">
                        <AvatarFallback className="flex items-center justify-center bg-neutral-200 text-2xl font-medium text-neutral-500">
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-sm font-medium text-neutral-900">{name || 'User'}</p>
                        <p className="text-xs font-medium text-neutral-500">{email}</p>
                    </div>
                </div>
                <Separator className="my-1" />
                <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="size-4" /> Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserButton
