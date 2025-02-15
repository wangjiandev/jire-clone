'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useJoinWorkspace } from '../api/use-join-workspace'
import { useInviteCode } from '../hooks/use-invite-code'
import { useWorkspaceId } from '../hooks/use-workspace-id'

interface JoinWorkspaceFormProps {
    initialValues: {
        name: string
    }
}

const JoinWorkspaceForm = ({ initialValues }: JoinWorkspaceFormProps) => {
    const { mutate, isPending } = useJoinWorkspace()
    const inviteCode = useInviteCode()
    const workspaceId = useWorkspaceId()
    const router = useRouter()

    const onSubmit = () => {
        mutate(
            {
                param: { workspaceId },
                json: { code: inviteCode },
            },
            {
                onSuccess: ({ data }) => {
                    router.push(`/workspaces/${data.$id}`)
                },
            },
        )
    }

    return (
        <Card className="h-full w-full border-none shadow-none">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
                <CardDescription>
                    You been invited to join a workspace <strong> {initialValues.name}</strong>
                </CardDescription>
            </CardHeader>
            <div className="py-7">
                <Separator />
            </div>
            <CardContent className="p-7">
                <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
                    <Button type="button" className="w-full lg:w-fit" variant="outline" disabled={isPending} asChild>
                        <Link href="/">Cancel</Link>
                    </Button>
                    <Button type="button" onClick={onSubmit} className="w-full lg:w-fit" disabled={isPending}>
                        Join Workspace
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default JoinWorkspaceForm
