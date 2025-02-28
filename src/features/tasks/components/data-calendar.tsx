import { Task } from '@/features/tasks/types'
import { addMonths, format, getDay, parse, startOfWeek, subMonths } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useState } from 'react'
import EventCard from './event-card'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './data-calendar.css'
import { ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CalendarIcon, ChevronLeftIcon } from 'lucide-react'

const locales = { zhCN }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface DataCalendarProps {
  data: Task[]
}

interface CustomToolbarProps {
  date: Date
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void
}

const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => {
  return (
    <div className="mb-4 flex w-full items-center justify-center gap-x-2 lg:w-auto lg:justify-start">
      <Button onClick={() => onNavigate('PREV')} variant="secondary" size="icon" className="flex items-center">
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="flex h-10 w-full items-center justify-center rounded-md border border-input px-3 py-2 lg:w-auto">
        <CalendarIcon className="mr-2 size-4" />
        <p className="text-sm">
          {format(date, 'MMMM yyyy', {
            locale: zhCN,
          })}
        </p>
      </div>
      <Button onClick={() => onNavigate('NEXT')} variant="secondary" size="icon" className="flex items-center">
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  )
}

const DataCalendar = ({ data }: DataCalendarProps) => {
  const [value, setValue] = useState(data.length > 0 ? new Date(data[0].dueDate) : new Date())

  const events = data.map((task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    id: task.$id,
  }))

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (action === 'PREV') {
      setValue(subMonths(value, 1))
    } else if (action === 'NEXT') {
      setValue(addMonths(value, 1))
    } else {
      setValue(new Date())
    }
  }

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={['month']}
      defaultView="month"
      showAllEvents
      className="h-full"
      toolbar
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) => localizer?.format(date, 'EEE', culture) ?? '',
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            assignee={event.assignee}
            project={event.project}
            status={event.status}
          />
        ),
        toolbar: () => <CustomToolbar date={value} onNavigate={handleNavigate} />,
      }}
    />
  )
}

export default DataCalendar
