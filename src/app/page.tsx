'use client'

import { useCurrent } from '@/features/auth/api/use-current'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/features/auth/api/use-logout'

export default function Home() {
  const router = useRouter()
  const { data, isLoading } = useCurrent()
  const { mutate } = useLogout()

  useEffect(() => {
    if (!data && !isLoading) {
      router.push('/sign-in')
    }
  }, [data])

  return (
    <div className="flex flex-col gap-4">
      <p>only visible to authenticated users</p>
      <p>{data?.email}</p>
      <div>
        <Button onClick={() => mutate()}>Logout</Button>
      </div>
    </div>
  )
}
