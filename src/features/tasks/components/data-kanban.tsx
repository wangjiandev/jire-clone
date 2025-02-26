import { useState } from 'react'
import { Task, TaskStatus } from '../types'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import KanbanColumnsHeader from './kanban-columns-header'

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
]

type TasksStatus = {
  [key in TaskStatus]: Task[]
}

interface DataKanbanProps {
  data: Task[]
}

const DataKanban = ({ data }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TasksStatus>(() => {
    const initialTasks: TasksStatus = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    }
    data?.forEach((task) => {
      initialTasks[task.status].push(task)
    })

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position)
    })

    return initialTasks
  })

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex w-96">
        {boards.map((board) => (
          <div key={board} className="mx-2 flex min-w-[240px] flex-col gap-y-2 rounded-md bg-muted p-1.5">
            <KanbanColumnsHeader board={board} taskCount={tasks[board].length} />
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}

export default DataKanban
