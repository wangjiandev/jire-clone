import { cn } from '@/lib/utils'
import { differenceInDays, format } from 'date-fns'
interface TaskDateProps {
  value: string
  className?: string
}

const TaskDate = ({ value, className }: TaskDateProps) => {
  const today = new Date()
  const endDay = new Date(value)
  const diffInDays = differenceInDays(endDay, today)

  let textColor = 'text-muted-foreground'
  if (diffInDays <= 3) {
    textColor = 'text-red-500'
  } else if (diffInDays <= 7) {
    textColor = 'text-orange-500'
  } else if (diffInDays <= 14) {
    textColor = 'text-yellow-500'
  } else if (diffInDays <= 30) {
    textColor = 'text-green-500'
  }

  return (
    <div className={cn(textColor, 'flex items-center justify-center')}>
      <span className={cn(className, 'truncate')}>{format(endDay, 'MM/dd/yyyy')}</span>
    </div>
  )
}

export default TaskDate
