import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.tasks)['bulk-update']['$post'], 200>
type RequestType = InferRequestType<(typeof client.api.tasks)['bulk-update']['$post']>

export const useBulkUpdateTasks = () => {
  const queryClint = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks['bulk-update'].$post({
        json,
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Task Updated')
      queryClint.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: () => {
      toast.error('Failed to update task')
    },
  })
  return mutation
}
