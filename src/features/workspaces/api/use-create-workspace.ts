import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.workspaces)['$post']>
type RequestType = InferRequestType<(typeof client.api.workspaces)['$post']>

export const useCreateWorkspace = () => {
  const queryClint = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.workspaces.$post({
        json,
      })

      if (!response.ok) {
        throw new Error('Failed to create workspace')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Workspace Created')
      queryClint.invalidateQueries({ queryKey: ['workspace'] })
    },
    onError: () => {
      toast.error('Failed to create workspace')
    },
  })
  return mutation
}
