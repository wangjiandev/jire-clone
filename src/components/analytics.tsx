import { ProjectAnalyticsResponseType } from '@/features/projects/api/use-get-project-analytics'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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
          <Separator orientation="vertical" />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Assigned Tasks"
            value={data.assignedTaskCount}
            variant={data.assignedDiff > 0 ? 'up' : 'down'}
            increaseValue={data.assignedDiff}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Completed Tasks"
            value={data.completedTaskCount}
            variant={data.completedDiff > 0 ? 'up' : 'down'}
            increaseValue={data.completedDiff}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Overdue Tasks"
            value={data.overdueTaskCount}
            variant={data.overdueDiff > 0 ? 'up' : 'down'}
            increaseValue={data.overdueDiff}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title="Incomplete Tasks"
            value={data.incompletedTaskCount}
            variant={data.incompletedDiff > 0 ? 'up' : 'down'}
            increaseValue={data.incompletedDiff}
          />
          <Separator orientation="vertical" />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default Analytics
