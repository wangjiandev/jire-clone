'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useCreateProject } from '@/features/projects/api/use-create-project'
import { createProjectSchema } from '@/features/projects/schema'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'

interface CreateProjectFormProps {
  onCancel?: () => void
}

const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const router = useRouter()
  const { mutate, isPending } = useCreateProject()
  const workspaceId = useWorkspaceId()
  const inputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const finalValue = {
      ...values,
      workspaceId,
      image: values.image instanceof File ? values.image : '',
    }
    mutate(
      { form: finalValue },
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
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new project</CardTitle>
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
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter project name" />
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
                        <p className="text-sm">Project Icon</p>
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
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CreateProjectForm
