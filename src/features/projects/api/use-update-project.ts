import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.projects)[':projectId']['$patch'], 200>
type RequestType = InferRequestType<(typeof client.api.projects)[':projectId']['$patch']>

export const useUpdateProject = () => {
  const queryClint = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.projects[':projectId'].$patch({
        param,
        form,
      })

      if (!response.ok) {
        throw new Error('Failed to update project')
      }

      return await response.json()
    },
    onSuccess: ({ data }) => {
      toast.success('Project Updated')
      queryClint.invalidateQueries({ queryKey: ['projects'] })
      queryClint.invalidateQueries({ queryKey: ['project', data.$id] })
    },
    onError: () => {
      toast.error('Failed to update project')
    },
  })
  return mutation
}
