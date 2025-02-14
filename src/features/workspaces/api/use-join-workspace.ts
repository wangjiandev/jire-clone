import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.workspaces)[':workspaceId']['join']['$post'], 200>
type RequestType = InferRequestType<(typeof client.api.workspaces)[':workspaceId']['join']['$post']>

export const useJoinWorkspace = () => {
  const queryClint = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json,param }) => {
      const response = await client.api.workspaces[':workspaceId']['join'].$post({
        json,
        param,
      })

      if (!response.ok) {
        throw new Error('Failed to join workspace')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('Joined workspace')
      queryClint.invalidateQueries({ queryKey: ['workspaces'] })
      queryClint.invalidateQueries({ queryKey: ['workspace', data.$id] })
    },
    onError: () => {
      toast.error('Failed to join workspace')
    },
  })
  return mutation
}
