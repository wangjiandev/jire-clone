import { ProjectAnalyticsResponseType } from '@/features/projects/api/use-get-project-analytics'
import { ScrollArea } from '@/components/ui/scroll-area'
import AnalyticsCard from './analytics-card'

interface AnalyticsProps {
  data: ProjectAnalyticsResponseType
}

const Analytics = ({ data }: AnalyticsProps) => {
  return (
    <ScrollArea className="w-full shrink-0 whitespace-nowrap rounded-lg border">
      <div className="flex w-full flex-row">
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Total Tasks"
            value={data.taskCount}
            variant={data.diff > 0 ? 'up' : 'down'}
            increaseValue={data.diff}
          />
        </div>
      </div>
    </ScrollArea>
  )
}

export default Analytics
