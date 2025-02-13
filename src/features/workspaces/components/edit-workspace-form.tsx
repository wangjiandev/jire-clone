'use client'

import Image from 'next/image'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { updateWorkspaceSchema } from '../schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeftIcon, ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

import { Workspace } from '../types'
import { useUpdateWorkspace } from '../api/use-update-workspace'

interface EditWorkspaceFormProps {
  onCancel?: () => void
  initialValues: Workspace
}

const EditWorkspaceForm = ({ onCancel, initialValues }: EditWorkspaceFormProps) => {
  const router = useRouter()
  const { mutate, isPending } = useUpdateWorkspace()
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
    mutate(
      {
        form: finalValue,
        param: {
          workspaceId: initialValues.$id,
        },
      },
      {
        onSuccess: ({ data }) => {
          form.reset()
          onCancel?.()
          if (data.id) {
            router.push(`/workspaces/${data.id}`)
          }
        },
      },
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('image', file)
    }
  }

  return (
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
  )
}

export default EditWorkspaceForm
