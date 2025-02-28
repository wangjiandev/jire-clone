interface AnalyticsCardProps {
  title: string
  value: number
  variant: 'up' | 'down'
  increaseValue: number
}

const AnalyticsCard = ({ title, value, variant, increaseValue }: AnalyticsCardProps) => {
  return (
    <div className="flex w-full flex-row">
      <div className="flex flex-1 items-center"></div>
    </div>
  )
}

export default AnalyticsCard
