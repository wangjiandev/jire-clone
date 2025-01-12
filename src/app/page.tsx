'use client'

import { useCurrent } from '@/features/auth/api/use-current'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const { data, isLoading } = useCurrent()

  useEffect(() => {
    if (!data && !isLoading) {
      router.push('/sign-in')
    }
  }, [data])

  return <div className="flex gap-4">only visible to authenticated users {JSON.stringify(data)}</div>
}
