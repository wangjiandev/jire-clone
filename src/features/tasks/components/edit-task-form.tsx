'use client'

import { z } from 'zod'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import DatePicker from '@/components/date-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createTaskSchema } from '@/features/tasks/schema'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import MemberAvatar from '@/features/members/components/member-avatar'
import ProjectAvatar from '@/features/projects/components/project-avatar'
import { useRouter } from 'next/navigation'
import { Task, TaskStatus } from '../types'
import { useUpdateTask } from '@/features/tasks/api/use-update-task'

interface EditTaskFormProps {
  onCancel?: () => void
  projectOptions: { id: string; name: string; imageUrl: string }[]
  memberOptions: { id: string; name: string }[]
  initialValue: Task
}

const EditTaskForm = ({ onCancel, projectOptions, memberOptions, initialValue }: EditTaskFormProps) => {
  const workspaceId = useWorkspaceId()
  const router = useRouter()
  const { mutate, isPending } = useUpdateTask()

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true, description: true })),
    defaultValues: {
      ...initialValue,
      dueDate: initialValue.dueDate ? new Date(initialValue.dueDate) : undefined,
    },
  })

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      { json: values, param: { taskId: initialValue.$id } },
      {
        onSuccess: () => {
          form.reset()
          onCancel?.()
        },
      },
    )
  }

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit task</CardTitle>
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
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter task name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <FormControl>
                      <Select defaultValue={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {memberOptions.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center gap-x-2">
                                <MemberAvatar name={member.name} className="size-6" />
                                {member.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select defaultValue={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                          <SelectItem value={TaskStatus.TODO}>ToDo</SelectItem>
                          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <FormControl>
                      <Select defaultValue={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectOptions.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              <div className="flex items-center gap-x-2">
                                <ProjectAvatar name={project.name} image={project.imageUrl} className="size-6" />
                                {project.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
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

export default EditTaskForm
