'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { useDeleteMember } from '@/features/members/api/use-delete-member'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useUpdateMember } from '@/features/members/api/use-update-member'
import MemberAvatar from '@/features/members/components/member-avatar'
import { MemberRole } from '@/features/members/types'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import useConfirm from '@/hooks/use-confirm'
import { ArrowLeft, Ellipsis, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'

const MembersList = () => {
  const workspaceId = useWorkspaceId()
  const { data, isLoading } = useGetMembers({ workspaceId })
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember()
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember()
  const [confirm, ConfirmationDialog] = useConfirm(
    'Remove member',
    'This member will be removed from the workspace',
    'destructive',
  )

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      param: { memberId },
      json: { role },
    })
  }

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm()
    if (!ok) return

    deleteMember(
      {
        param: { memberId },
      },
      {
        onSuccess: () => {
          window.location.reload()
        },
      },
    )
  }

  return (
    <Card className="h-full w-full border-none shadow-none">
      <ConfirmationDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
        <Button variant="outline" asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <CardTitle className="text-xl font-semibold">Members List</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-7">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : (
          data?.documents.map((member, index) => (
            <Fragment key={member.$id}>
              <div className="flex items-center gap-2">
                <MemberAvatar className="size-10" fallbackClassName="text-lg" name={member.name} />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto">
                      <Ellipsis className="size-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}
                      disabled={isUpdating}>
                      Set as Administrator
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}
                      disabled={isUpdating}>
                      Set as Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium text-red-500"
                      onClick={() => handleDeleteMember(member.$id)}
                      disabled={isDeleting}>
                      Remove {member.name}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {index < data.documents.length - 1 && <Separator className="my-2.5" />}
            </Fragment>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default MembersList
