import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.tasks)[':taskId']['$patch'], 200>
type RequestType = InferRequestType<(typeof client.api.tasks)[':taskId']['$patch']>

export const useUpdateTask = () => {
  const queryClint = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tasks[':taskId'].$patch({
        param,
        json,
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('Task Updated')
      queryClint.invalidateQueries({ queryKey: ['tasks'] })
      queryClint.invalidateQueries({ queryKey: ['task', data.$id] })
    },
    onError: () => {
      toast.error('Failed to update task')
    },
  })
  return mutation
}
