import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from './ui/calendar'

interface DatePickerProps {
  value: Date | undefined
  onChange: (date: Date) => void
  className?: string
  placeholder?: string
}

const DatePicker = ({ value, onChange, className, placeholder = 'Select Date' }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={cn(
            'w-full justify-start px-3 text-left font-normal',
            !value && 'text-muted-foreground',
            className,
          )}>
          <CalendarIcon className="size-4" />
          {value ? format(value, 'PPP') : <span>placeholder</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={(date) => onChange(date ?? new Date())} initialFocus />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
