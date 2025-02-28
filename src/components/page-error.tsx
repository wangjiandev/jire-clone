import { AlertTriangle } from 'lucide-react'

interface PageErrorProps {
  message: string
}

const PageError = ({ message = 'Something went wrong' }: PageErrorProps) => {
  return (
    <div className="flex h-full items-center justify-center">
      <AlertTriangle className="mb-2 size-6 text-muted-foreground" />
      <p className="text-sm font-semibold text-muted-foreground">{message}</p>
    </div>
  )
}

export default PageError
