'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

const ErrorPage = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <Button variant="secondary" asChild>
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  )
}

export default ErrorPage
