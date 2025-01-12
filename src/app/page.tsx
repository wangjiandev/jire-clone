import { Button } from '@/components/ui/button'
import { createAdminClient } from '@/lib/appwrite'

export default function Home() {
  console.log('createAdminClient: ', createAdminClient)
  return (
    <div className="flex gap-4">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}
