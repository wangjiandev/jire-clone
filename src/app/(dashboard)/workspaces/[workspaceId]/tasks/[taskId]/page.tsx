import { getCurrent } from '@/features/auth/queries'
import { redirect } from 'next/navigation'
import TaskIdClient from './client'

interface TaskIdPageProps {
  params: {
    taskId: string
  }
}

const TaskIdPage = async ({ params }: TaskIdPageProps) => {
  const user = await getCurrent()
  if (!user) redirect('/sign-in')

  return <TaskIdClient />
}

export default TaskIdPage
