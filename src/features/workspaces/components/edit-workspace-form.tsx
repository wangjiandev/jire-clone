'use client'

import Image from 'next/image'
import useConfirm from '@/hooks/use-confirm'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeftIcon, CopyIcon, ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace'
import { useDeleteWorkspace } from '@/features/workspaces/api/use-delete-workspace'
import { useResetInviteCode } from '@/features/workspaces/api/use-reset-invite-code'
import { toast } from 'sonner'
import { updateWorkspaceSchema } from '../schema'
import { Workspace } from '../types'

interface EditWorkspaceFormProps {
  onCancel?: () => void
  initialValues: Workspace
}

const EditWorkspaceForm = ({ onCancel, initialValues }: EditWorkspaceFormProps) => {
  const router = useRouter()
  const { mutate, isPending } = useUpdateWorkspace()
  const { mutate: deleteWorkspace, isPending: isDeleting } = useDeleteWorkspace()
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } = useResetInviteCode()

  const [confirmDelete, ConfirmationDialog] = useConfirm(
    'Delete Workspace',
    'Are you sure you want to delete this workspace?',
    'destructive',
  )
  const [confirmResetInviteCode, ConfirmationResetInviteCodeDialog] = useConfirm(
    'Reset Invite Code',
    'Are you sure you want to reset the invite code?',
    'destructive',
  )
  const inputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? '',
    },
  })

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValue = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    }
    mutate({
      form: finalValue,
      param: {
        workspaceId: initialValues.$id,
      },
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('image', file)
    }
  }

  const handleDeleteWorkspace = async () => {
    const isConfirmed = await confirmDelete()
    if (!isConfirmed) return
    deleteWorkspace(
      {
        param: {
          workspaceId: initialValues.$id,
        },
      },
      {
        onSuccess: () => {
          router.push('/')
        },
      },
    )
  }

  const handleResetInviteCode = async () => {
    const isConfirmed = await confirmResetInviteCode()
    if (!isConfirmed) return
    resetInviteCode({
      param: {
        workspaceId: initialValues.$id,
      },
    })
  }

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => toast.success('Invite link copied to clipboard'))
  }

  return (
    <div className="flex flex-col gap-y-4">
      <ConfirmationDialog />
      <ConfirmationResetInviteCodeDialog />
      <Card className="h-full w-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
          <Button
            variant="ghost"
            size="icon"
            className="size-10"
            onClick={onCancel ?? (() => router.push(`/workspaces/${initialValues.$id}`))}>
            <ArrowLeftIcon className="size-4"></ArrowLeftIcon>
          </Button>
          <CardTitle className="text-xl font-bold">{initialValues.name}</CardTitle>
        </CardHeader>
        <div className="p-7">
          <Separator />
        </div>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="relative size-[72px] overflow-hidden rounded-md">
                            <Image
                              src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                              alt="logo"
                              className="object-cover"
                              fill></Image>
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400"></ImageIcon>
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Workspace Icon</p>
                          <p className="text-sm text-muted-foreground">JPG, PNG, SVG, max 1MB</p>
                          <input
                            className="hidden"
                            accept=".jpg,.png,.svg"
                            type="file"
                            ref={inputRef}
                            disabled={isPending}
                            onChange={handleImageChange}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="secondary"
                              size="sm"
                              className="mt-2 w-fit"
                              onClick={() => {
                                field.onChange(null)
                                if (inputRef.current) {
                                  inputRef.current.value = ''
                                }
                              }}>
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="secondary"
                              size="sm"
                              className="mt-2 w-fit"
                              onClick={() => inputRef.current?.click()}>
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <div className="py-7">
                <Separator />
              </div>
              <div className="flex items-center justify-between">
                <Button
                  onClick={onCancel}
                  type="button"
                  size="lg"
                  variant="secondary"
                  disabled={isPending}
                  className={cn(!onCancel && 'invisible')}>
                  Cancel
                </Button>
                <Button type="submit" size="lg" disabled={isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col gap-y-4">
            <h3 className="font-bold">Delete Workspace</h3>
            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            <div className="py-7">
              <Separator />
            </div>
            <Button
              className="ml-auto w-fit"
              variant="destructive"
              disabled={isPending || isDeleting}
              onClick={handleDeleteWorkspace}
              type="button">
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col gap-y-4">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">Use the link below to invite members to your workspace.</p>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <Input type="text" value={fullInviteLink} disabled />
                <Button type="button" variant="secondary" onClick={handleCopyInviteLink}>
                  <CopyIcon className="size-4" />
                </Button>
              </div>
            </div>
            <div className="py-7">
              <Separator />
            </div>
            <Button
              className="ml-auto w-fit"
              disabled={isPending || isResettingInviteCode}
              onClick={handleResetInviteCode}
              type="button">
              Reset Invite Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditWorkspaceForm
