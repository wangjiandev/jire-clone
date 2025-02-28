import { client } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

interface GetWorkspaceInfoOptions {
  workspaceId: string
}

export const useGetWorkspaceInfo = ({ workspaceId }: GetWorkspaceInfoOptions) => {
  const query = useQuery({
    queryKey: ['workspace-info', workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[':workspaceId']['info'].$get({
        param: {
          workspaceId,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch workspace')
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}
