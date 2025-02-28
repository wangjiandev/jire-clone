import { Button } from '@/components/ui/button'
import { Task } from '../types'
import { PencilIcon, XIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import OverviewProperty from './overview-property'
import MemberAvatar from '@/features/members/components/member-avatar'
import TaskDate from './task-date'
import { Badge } from '@/components/ui/badge'
import { snakeCaseToTitleCase } from '@/lib/utils'
import { useEditTaskModal } from '../hooks/use-edit-task-modal'
import { useState } from 'react'
import { useUpdateTask } from '../api/use-update-task'
import { Textarea } from '@/components/ui/textarea'

interface TaskDescriptionProps {
  task: Task
}

const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(task.description)
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask()

  const handleSubmit = async () => {
    updateTask({
      json: { description: value },
      param: { taskId: task.$id },
    })
    setIsEditing(false)
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Description</p>
        <Button onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? <XIcon className="mr-2 size-4" /> : <PencilIcon className="mr-2 size-4" />}
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>
      <Separator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="add a description..."
            value={value}
            rows={4}
            onChange={(e) => setValue(e.target.value)}
            disabled={isUpdating}
          />
          <Button variant="secondary" disabled={isUpdating} onClick={handleSubmit} className="ml-auto w-fit">
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          {task.description || <span className="text-muted-foreground">No description provided</span>}
        </div>
      )}
    </div>
  )
}

export default TaskDescription
