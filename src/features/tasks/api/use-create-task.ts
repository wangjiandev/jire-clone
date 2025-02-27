import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type ResponseType = InferResponseType<(typeof client.api.tasks)['$post'], 200>
type RequestType = InferRequestType<(typeof client.api.tasks)['$post']>

export const useCreateTask = () => {
  const router = useRouter()
  const queryClint = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks.$post({
        json,
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Task Created')
      router.refresh()
      queryClint.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: () => {
      toast.error('Failed to create task')
    },
  })
  return mutation
}
