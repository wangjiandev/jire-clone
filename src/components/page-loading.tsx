import { Loader } from 'lucide-react'

const PageLoading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}

export default PageLoading
