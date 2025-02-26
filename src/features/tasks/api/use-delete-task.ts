import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type ResponseType = InferResponseType<(typeof client.api.tasks)[':taskId']['$delete'], 200>
type RequestType = InferRequestType<(typeof client.api.tasks)[':taskId']['$delete']>

export const useDeleteTask = () => {
  const router = useRouter()
  const queryClint = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[':taskId']['$delete']({
        param,
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('Task Deleted')

      // router.refresh()
      queryClint.invalidateQueries({ queryKey: ['tasks'] })
      queryClint.invalidateQueries({ queryKey: ['task', data.$id] })
    },
    onError: () => {
      toast.error('Failed to delete task')
    },
  })
  return mutation
}
