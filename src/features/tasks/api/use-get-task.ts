import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

interface GetTaskOptions {
  taskId: string
}

export const useGetTask = ({ taskId }: GetTaskOptions) => {
  const query = useQuery({
    queryKey: ['tasks', taskId],
    queryFn: async () => {
      const response = await client.api.tasks[':taskId'].$get({
        param: {
          taskId,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch task')
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}
