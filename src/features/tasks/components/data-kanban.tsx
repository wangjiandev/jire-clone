import { useCallback, useEffect, useState } from 'react'
import { Task, TaskStatus } from '../types'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import KanbanColumnsHeader from './kanban-columns-header'
import KanbanCard from './kanban-card'

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
  onChange: (task: { $id: string; status: TaskStatus; position: number }[]) => void
}

const DataKanban = ({ data, onChange }: DataKanbanProps) => {
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

  useEffect(() => {
    const newTasks: TasksStatus = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    }

    data.forEach((task) => {
      newTasks[task.status].push(task)
    })

    Object.keys(newTasks).forEach((status) => {
      newTasks[status as TaskStatus].sort((a, b) => a.position - b.position)
    })

    setTasks(newTasks)
  }, [data])

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, type } = result
      if (!destination) return

      const sourceStatus = source.droppableId as TaskStatus
      const destinationStatus = destination.droppableId as TaskStatus

      let updatesPayload: { $id: string; status: TaskStatus; position: number }[] = []

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks }
        const sourceColumn = [...newTasks[sourceStatus]]
        const [movedTask] = sourceColumn.splice(source.index, 1)

        if (!movedTask) {
          console.error('no task found at the source index')
          return prevTasks
        }

        const updatedMovedTask =
          sourceStatus !== destinationStatus ? { ...movedTask, status: destinationStatus } : movedTask

        newTasks[sourceStatus] = sourceColumn
        const descColumn = [...newTasks[destinationStatus]]
        descColumn.splice(destination.index, 0, updatedMovedTask)
        newTasks[destinationStatus] = descColumn

        updatesPayload = []

        updatesPayload.push({
          $id: updatedMovedTask.$id,
          status: destinationStatus,
          position: Math.min((destination.index + 1) * 1000, 1000000),
        })

        newTasks[destinationStatus].forEach((task, index) => {
          if (task && task.$id !== updatedMovedTask.$id) {
            const newPossition = Math.min((index + 1) * 1000, 1000000)
            if (task.position !== newPossition) {
              updatesPayload.push({
                $id: task.$id,
                status: destinationStatus,
                position: newPossition,
              })
            }
          }
        })

        if (sourceStatus !== destinationStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            if (task) {
              const newPosition = Math.min((index + 1) * 1000, 1000000)
              if (task.position !== newPosition) {
                updatesPayload.push({
                  $id: task.$id,
                  status: sourceStatus,
                  position: newPosition,
                })
              }
            }
          })
        }

        return newTasks
      })
      onChange(updatesPayload)
    },
    [onChange],
  )

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex w-96">
        {boards.map((board) => (
          <div key={board} className="mx-2 flex min-w-[240px] flex-col gap-y-2 rounded-md bg-muted p-1.5">
            <KanbanColumnsHeader board={board} taskCount={tasks[board].length} />
            <Droppable droppableId={board}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[300px] py-1.5">
                  {tasks[board].map((task, index) => (
                    <Draggable key={task.$id} draggableId={task.$id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <KanbanCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}

export default DataKanban
